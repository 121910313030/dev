# from django.http import HttpResponse
# from django.http import JsonResponse
# from .extract import get_pdf_text


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
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
        serializer = ResumeSerializer(data=request.data)
        file1 = request.FILES.get("resume_file")
        file2 = request.FILES.get("jd_file")


        if not file1:
            return Response({"error": "No file uploaded"}, status=400)

        # Extract text
        extracted_text1 = get_pdf_text(file1)
        
        
        resume = Resume.objects.create(
        resume_file=file1,jd_file=file2,
        extracted_text=extracted_text1)
        return Response({
        "message": "Uploaded successfully"
        })

