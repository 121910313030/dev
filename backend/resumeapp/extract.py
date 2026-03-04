import fitz  

def get_pdf_text(file_stream):
    
    text = ""
    try:
        # Open the PDF from the memory stream
        with fitz.open(stream=file_stream.read(), filetype="pdf") as doc:
            for page in doc:
                text += page.get_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None