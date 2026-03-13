from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Resume
from .serializer import ResumeSerializer
from .ai_scoring import get_resume_score
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
        data = Resume.objects.all().order_by('-uploaded_at')
        serializer = ResumeSerializer(data, many=True)
        return Response(serializer.data)

    if request.method == "POST":

        files = request.FILES.getlist("resumes")
        jd_file = request.FILES.get("jd_file")

        if not files:
            return Response({"error": "No resumes uploaded"}, status=400)

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
            print("AI error:", e)
            return Response({"error": "AI scoring failed"}, status=500)

        candidates = []

        for i, result in enumerate(ai_results):

            resume_obj = Resume.objects.create(
                resume_file=resumes_for_ai[i]["file_obj"],
                jd_file=jd_file,
                extracted_text1=resumes_for_ai[i]["text"],
                extracted_text2=extracted_text_jd,
                score=result["score"],
                analysis_reason=result["reason"]
            )

            candidates.append({
                "id": resume_obj.id,
                "name": resumes_for_ai[i]["name"],
                "score": result["score"],
                "skills": result.get("skills", []),
                "justification": result["reason"]
            })

        return Response({
            "candidates": candidates
        })