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


def extract_required_years(jd_text):
    jd_years_match = re.search(r'(\d+)\s*(?:\+|years|year|yrs|exp)', jd_text.lower())
    return int(jd_years_match.group(1)) if jd_years_match else 0


def parse_weights(request_data):
    default_weights = {"skills": 50, "experience": 30, "semantic": 20}
    raw_weights = request_data.get("weights")
    try:
        return json.loads(raw_weights) if raw_weights else default_weights
    except Exception:
        return default_weights


def process_resume(result, jd_required_years, resume_data):
    try:
        raw_years = result.get("experience_years") or result.get("experience") or 0
        match = re.search(r'\d+', str(raw_years))
        ext_experience = int(match.group()) if match else 0

        if jd_required_years > 0:
            alignment = (ext_experience / jd_required_years) * 100
            exp_val = min(100, int(alignment))
        else:
            exp_val = 100 if ext_experience > 0 else 0
    except Exception:
        exp_val = 0
        ext_experience = 0

    resume_obj = Resume.objects.create(
        batch=resume_data["batch"],
        resume_file=resume_data["file_obj"],
        jd_file=resume_data["jd_file"],
        extracted_text1=resume_data["text"],
        extracted_text2=resume_data["jd_text"],
        score=result.get("score", 0),
        experience_years=ext_experience,
        experience_score=exp_val,
        analysis_reason=result.get("reason", "No reason provided"),
        confidence_level=str(result.get("confidence_level", "medium")).lower(),
        raw_ai_response=result,
    )

    return {
        "id": resume_obj.id,
        "batch_id": resume_data["batch"].id,
        "name": resume_data["name"],
        "score": resume_obj.score,
        "experience_years": ext_experience,
        "experience_score": exp_val,
        "confidence": resume_obj.confidence_level,
        "justification": resume_obj.analysis_reason,
    }


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

        jd_text = get_pdf_text(jd_file) if jd_file else ""
        jd_required_years = extract_required_years(jd_text)
        custom_weights = parse_weights(request.data)

        current_batch = ResumeBatch.objects.create(name=f"Upload of {len(files)} resumes")

        resumes_for_ai = [{"name": f.name, "text": get_pdf_text(f), "file_obj": f} for f in files]

        try:
            ai_results = get_resume_score(resumes_for_ai, jd_text, custom_weights)
        except Exception as e:
            current_batch.delete()
            return Response({"error": f"AI scoring failed: {str(e)}"}, status=500)

        candidates = [
            process_resume(result, jd_required_years, {
                "batch": current_batch,
                "jd_file": jd_file,
                "jd_text": jd_text,
                **resumes_for_ai[i],
            })
            for i, result in enumerate(ai_results)
        ]

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