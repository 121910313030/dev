from django.db import models

class Resume(models.Model):
    resume_file = models.FileField(upload_to='resumes/',null=True)
    jd_file = models.FileField(upload_to= "jds/",null=True)
    extracted_text = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Upload {self.id}"

