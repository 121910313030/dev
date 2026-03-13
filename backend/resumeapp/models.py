from django.db import models

class Resume(models.Model):
    resume_file = models.FileField(upload_to='resumes/',null=True)
    jd_file = models.FileField(upload_to= "jds/",null=True, blank = True)


    extracted_text1 = models.TextField(blank=True, null=True)
    extracted_text2 = models.TextField(blank=True, null=True)

    score = models.IntegerField(null=True, blank=True)
    analysis_reason = models.TextField(blank=True, null=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume {self.id} - Score: {self.score}"

