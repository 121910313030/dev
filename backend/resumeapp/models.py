from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_name = models.TextField(max_length=100,blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    

class ResumeBatch(models.Model):
    # This identifies the specific upload session
    name = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        CustomUser,
        
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )

    def __str__(self):
        return f"Batch {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class Resume(models.Model):


    # Confidence Level choices for the UI Badge
    CONFIDENCE_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

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
    experience_score = models.IntegerField(default=0)
    analysis_reason = models.TextField(blank=True, null=True)

    confidence_level = models.CharField(
        max_length=10, 
        choices=CONFIDENCE_CHOICES, 
        default='medium'
    )
    formatting_note = models.TextField(blank=True, null=True)
    raw_ai_response = models.JSONField(null=True, blank=True) # Recommended for PostgreSQL
    
    uploaded_at = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        return f"Batch {self.batch_id} | Resume {self.id} - Score: {self.score}"