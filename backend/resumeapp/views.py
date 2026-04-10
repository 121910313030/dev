from rest_framework.decorators import api_view, authentication_classes
import re
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
from .profile_views import update_password, profile_detail, update_settings
from rest_framework.permissions import AllowAny

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
        data = Resume.objects.filter(batch_id=batch_id).order_by('-score') if batch_id else Resume.objects.all().order_by('-uploaded_at')
        serializer = ResumeSerializer(data, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        files = request.FILES.getlist("resumes")
        jd_file = request.FILES.get("jd_file")

        if not files:
            return Response({"error": "No resumes uploaded"}, status=400)
        
        # 1. EXTRACT JD TEXT AND REQUIRED YEARS
        extracted_text_jd = get_pdf_text(jd_file) if jd_file else ""
        
        # Look for numbers near "years", "yrs", or "exp" (e.g., "3+ years")
        jd_years_match = re.search(r'(\d+)\s*(?:\+|years|year|yrs|exp)', extracted_text_jd.lower())
        jd_required_years = int(jd_years_match.group(1)) if jd_years_match else 0
        
        # Weights Logic
        default_weights = {"skills": 50, "experience": 30, "semantic": 20}
        raw_weights = request.data.get("weights")
        try:
            custom_weights = json.loads(raw_weights) if raw_weights else default_weights
        except Exception:
            custom_weights = default_weights

        # Create Batch
        batch_name = f"Upload of {len(files)} resumes"
        current_batch = ResumeBatch.objects.create(name=batch_name)

        resumes_for_ai = []
        for file in files:
            text = get_pdf_text(file)
            resumes_for_ai.append({"name": file.name, "text": text, "file_obj": file})

        try:
            ai_results = get_resume_score(resumes_for_ai, extracted_text_jd, custom_weights)
        except Exception as e:
            current_batch.delete() 
            return Response({"error": f"AI scoring failed: {str(e)}"}, status=500)

        candidates = []
        for i, result in enumerate(ai_results):
            try:
                # 2. EXTRACT YEARS FROM CANDIDATE
                raw_years = result.get("experience_years") or result.get("experience") or 0
                # Clean strings like "5+" or "2 years" into an integer
                ext_experience = int(re.search(r'\d+', str(raw_years)).group()) if re.search(r'\d+', str(raw_years)) else 0
                
                # 3. CALCULATE PROGRESS BAR (ALIGNMENT)
                if jd_required_years > 0:
                    # If they have 5 years and JD wants 3, they are 100% aligned.
                    alignment = (ext_experience / jd_required_years) * 100
                    exp_val = min(100, int(alignment))
                else:
                    # Fallback if JD doesn't specify years
                    exp_val = 100 if ext_experience > 0 else 0

            except Exception:
                exp_val = 0
                ext_experience = 0

            # Create Resume Object
            resume_obj = Resume.objects.create(
                batch=current_batch,
                resume_file=resumes_for_ai[i]["file_obj"],
                jd_file=jd_file,
                extracted_text1=resumes_for_ai[i]["text"],
                extracted_text2=extracted_text_jd,
                score=result.get("score", 0),
                experience_years=ext_experience, 
                experience_score=exp_val, # THIS FEEDS THE PROGRESS BAR
                analysis_reason=result.get("reason", "No reason provided"),
                confidence_level=str(result.get("confidence_level", "medium")).lower(),
                raw_ai_response=result,
            )
            
            candidates.append({
                "id": resume_obj.id,
                "batch_id": current_batch.id,
                "name": resumes_for_ai[i]["name"],
                "score": resume_obj.score,
                "experience_years": ext_experience, 
                "experience_score": exp_val, # React reads this for the bar
                "confidence": resume_obj.confidence_level,
                "justification": resume_obj.analysis_reason,
            })

        return Response({"batch_id": current_batch.id, "candidates": candidates})
    
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
@authentication_classes([]) 
def resume_detail_api(request, pk):

    resume = get_object_or_404(Resume, pk=pk)
    print(resume)
    if request.method == 'PATCH':
        resume.score = request.data.get('score', resume.score)
        resume.save()
        return Response({"message": "Updated"})
    elif request.method == 'DELETE':
        resume.delete()
        return Response(status=204)