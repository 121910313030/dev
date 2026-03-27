from django.db import models

class ResumeBatch(models.Model):
    # This identifies the specific upload session
    name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Batch {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Resume(models.Model):
    # LINK TO BATCH: Every resume now belongs to a specific upload group
    batch = models.ForeignKey(
        ResumeBatch, 
        on_delete=models.CASCADE, 
        related_name='resumes',
        null=True # Keep null=True initially if you have existing data
    )
    
    resume_file = models.FileField(upload_to='resumes/', null=True)
    jd_file = models.FileField(upload_to="jds/", null=True, blank=True)

    extracted_text1 = models.TextField(blank=True, null=True)
    extracted_text2 = models.TextField(blank=True, null=True)

    score = models.IntegerField(null=True, blank=True)
    experience_years = models.IntegerField(null=True, blank=True)
    analysis_reason = models.TextField(blank=True, null=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Batch {self.batch_id} | Resume {self.id} - Score: {self.score}"