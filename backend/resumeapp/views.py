from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Resume, ResumeBatch
from .serializer import ResumeSerializer
from .ai_scoring import get_resume_score
from .signup import signup_user
import fitz


def get_pdf_text(file_stream):
    text = ""

    try:
        file_bytes = file_stream.read()

        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text() + "\n"

        file_stream.seek(0)
        return text

    except Exception as e:
        print("PDF error:", e)
        return ""


@api_view(['GET', 'POST'])
def resume_api(request):

    if request.method == "GET":
        # Check if the frontend is asking for a specific batch
        batch_id = request.query_params.get('batch_id')
        
        if batch_id:
            # ONLY return resumes from this specific upload session
            data = Resume.objects.filter(batch_id=batch_id).order_by('-score')
        else:
            # Fallback: return everything (or you can return error if batch is required)
            data = Resume.objects.all().order_by('-uploaded_at')
            
        serializer = ResumeSerializer(data, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        files = request.FILES.getlist("resumes")
        jd_file = request.FILES.get("jd_file")

        if not files:
            return Response({"error": "No resumes uploaded"}, status=400)

        # --- NEW: Create a Batch Record for this upload session ---
        batch_name = f"Upload of {len(files)} resumes"
        current_batch = ResumeBatch.objects.create(name=batch_name)
        # ----------------------------------------------------------

        extracted_text_jd = get_pdf_text(jd_file) if jd_file else "General Analysis"
        resumes_for_ai = []

        for file in files:
            text = get_pdf_text(file)
            resumes_for_ai.append({
                "name": file.name,
                "text": text,
                "file_obj": file
            })

        try:
            ai_results = get_resume_score(resumes_for_ai, extracted_text_jd)
        except Exception as e:
            current_batch.delete() # Clean up the empty batch if AI fails
            return Response({"error": "AI scoring failed"}, status=500)

        candidates = []

        for i, result in enumerate(ai_results):
            # Check multiple possible keys from AI result to avoid the "0" default
            ext_experience = result.get("experience_years") or result.get("experience") or result.get("years") or 0
            
            resume_obj = Resume.objects.create(
                batch=current_batch,
                resume_file=resumes_for_ai[i]["file_obj"],
                jd_file=jd_file,
                extracted_text1=resumes_for_ai[i]["text"],
                extracted_text2=extracted_text_jd,
                score=result.get("score", 0),
                experience_years = result.get('experience_years', 0),
                analysis_reason=result.get("reason", "No reason provided")
            )
            
            candidates.append({
                "id": resume_obj.id,
                "batch_id": current_batch.id, # Send batch ID back to frontend
                "name": resumes_for_ai[i]["name"],
                "score": result["score"],
                "experience_years": "Determine total professional years. If the text says '5 years', return 5. If it's an intern, return 0. RETURN ONLY AN INTEGER.",
                "justification": result["reason"]
            })

        return Response({
            "batch_id": current_batch.id, # Frontend uses this to redirect to dashboard
            "candidates": candidates
        })


@api_view(['GET'])
def batch_list_api(request):
    # This is what populates your "Recent Activity" and Dashboard Stats
    batches = ResumeBatch.objects.all().order_by('-created_at')
    data = []
    for b in batches:
        resumes = b.resumes.all()
        # Calculate avg score for the dashboard
        avg = sum(r.score or 0 for r in resumes) / resumes.count() if resumes.exists() else 0
        
        data.append({
            "id": b.id,
            "name": f"Batch Analysis #{b.id}",
            "date": b.created_at.strftime('%d %b, %Y'),
            "time": b.created_at.strftime('%I:%M %p'),
            "resume_count": resumes.count(),
            "avg_score": round(avg, 1)
        })
    return Response(data)


@api_view(['PUT', 'DELETE'])
def resume_detail_api(request, pk):
    """
    Handles actions on a single resume: 
    Updating the score (Human-in-the-loop) or Deleting it.
    """
    try:
        resume = Resume.objects.get(pk=pk)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=404)

    if request.method == "PUT":
        # Supports the manual score update from AdminDashboard.js
        new_score = request.data.get("score")
        if new_score is not None:
            resume.score = new_score
            resume.save()
            return Response({"message": "Score updated successfully"})
        return Response({"error": "No score provided"}, status=400)

    if request.method == "DELETE":
        # Supports the Trash icon in AdminDashboard.js
        resume.delete()
        return Response({"message": "Deleted successfully"}, status=204)