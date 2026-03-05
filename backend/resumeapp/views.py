from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Resume
from .serializer import ResumeSerializer
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
        print(f"Error extracting PDF: {e}")
        return None


@api_view(['GET', 'POST'])
def resume_api(request):

    if request.method == "GET":
        data = Resume.objects.all()
        serializer = ResumeSerializer(data, many=True)
        return Response(serializer.data)

    elif request.method == "POST":

        files = request.FILES.getlist("resumes")   # multiple resumes
        jd_file = request.FILES.get("jd_file")  # single JD

        if not files:
            return Response({"error": "No resumes uploaded"}, status=400)

        uploaded_files = []
        
        extracted_text_jd = get_pdf_text(jd_file)
        for file in files:

            extracted_text = get_pdf_text(file)

            if jd_file:
                jd_file.seek(0)   # reset pointer
            
            resume = Resume.objects.create(
                resume_file=file,
                jd_file=jd_file,
                extracted_text2 = extracted_text_jd, 
                extracted_text1=extracted_text
            )

            uploaded_files.append(file.name)
        
        return Response({
            "message": "Resumes uploaded successfully",
            "files": uploaded_files
        })