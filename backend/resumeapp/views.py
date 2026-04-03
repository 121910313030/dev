from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Resume, ResumeBatch
from .serializer import ResumeSerializer
from .ai_scoring import get_resume_score
from .signup import signup_user
import fitz
from .adminuser import admin_overview
from .login import login_user
from .models import Resume
from django.shortcuts import get_object_or_404
import json

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
        batch_id = request.query_params.get('batch_id')
        if batch_id:
            data = Resume.objects.filter(batch_id=batch_id).order_by('-score')
        else:
            data = Resume.objects.all().order_by('-uploaded_at')
            
        serializer = ResumeSerializer(data, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        files = request.FILES.getlist("resumes")
        jd_file = request.FILES.get("jd_file")

        if not files:
            return Response({"error": "No resumes uploaded"}, status=400)
        
        default_weights = {"skills": 50, "experience": 30, "semantic": 20}
        raw_weights = request.data.get("weights")
        
        try:
            custom_weights = json.loads(raw_weights) if raw_weights else default_weights
        except Exception:
            custom_weights = default_weights

        if not files:
            return Response({"error": "No resumes uploaded"}, status=400)
        

        # Create Batch
        batch_name = f"Upload of {len(files)} resumes"
        current_batch = ResumeBatch.objects.create(name=batch_name)

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
            ai_results = get_resume_score(resumes_for_ai, extracted_text_jd, custom_weights)
        except Exception as e:
            current_batch.delete() 
            return Response({"error": "AI scoring failed"}, status=500)

        candidates = []

        for i, result in enumerate(ai_results):
            # 1. SAFETY CASTING: Convert potential strings/None to Integers
            try:
                # We use a helper to strip "%" or handle None
                raw_score = result.get("experience_score") or result.get("experience_match") or 0
                exp_val = int(str(raw_score).replace('%', '').strip())
                
                raw_years = result.get("experience_years") or result.get("experience") or 0
                ext_experience = int(str(raw_years).replace('+', '').strip())
            except (ValueError, TypeError):
                exp_val = 0
                ext_experience = 0

            conf_level = str(result.get("confidence_level", "medium")).lower()
            if conf_level not in ['high', 'medium', 'low']:
                conf_level = 'medium'
            
            # 2. CREATE OBJECT
            resume_obj = Resume.objects.create(
                batch=current_batch,
                resume_file=resumes_for_ai[i]["file_obj"],
                jd_file=jd_file,
                extracted_text1=resumes_for_ai[i]["text"],
                extracted_text2=extracted_text_jd,
                score=result.get("score", 0),
                experience_years=ext_experience, 
                experience_score=exp_val, # Ensure this is an INT
                analysis_reason=result.get("reason", "No reason provided"),
                confidence_level=conf_level,
                formatting_note=result.get("formatting_note", "Standard format detected."),
                raw_ai_response=result,
            )
            
            # 3. APPEND TO CANDIDATES
            candidates.append({
                "id": resume_obj.id,
                "batch_id": current_batch.id,
                "name": resumes_for_ai[i]["name"],
                "score": resume_obj.score,
                "experience_years": ext_experience, 
                "confidence": resume_obj.confidence_level,
                "justification": resume_obj.analysis_reason,
                
                # PERSISTENCE FIX: Send BOTH keys so React never sees a 0%
                "experience_score": resume_obj.experience_score,
                "experience_match": resume_obj.experience_score, 
            })

        return Response({
            "batch_id": current_batch.id,
            "candidates": candidates
        })

@api_view(['GET'])
def batch_list_api(request):
    # FIX 4: Use prefetch_related for speed and to ensure all related resumes are caught
    batches = ResumeBatch.objects.prefetch_related('resumes').all().order_by('-created_at')
    
    data = []
    for b in batches:
        resumes = b.resumes.all()
        r_count = resumes.count()
        
        
        # Avoid division by zero
        avg = sum(r.score or 0 for r in resumes) / r_count if r_count > 0 else 0
        
        data.append({
            "id": b.id,
            "name": f"Batch Analysis #{b.id}",
            "date": b.created_at.strftime('%d %b, %Y'),
            "time": b.created_at.strftime('%I:%M %p'),
            "resume_count": r_count,
            "avg_score": round(avg, 1)
        })
    return Response(data)

@api_view(['PATCH', 'DELETE'])
def resume_detail_api(request, pk):

    resume = get_object_or_404(Resume, pk=pk)

    if request.method == 'PATCH':
        resume.score = request.data.get('score', resume.score)
        resume.save()
        return Response({"message": "Updated"})
    elif request.method == 'DELETE':
        resume.delete()
        return Response(status=204)