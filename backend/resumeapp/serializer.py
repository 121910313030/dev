from rest_framework import serializers
from .models import Resume
from .models import CustomUser


class ResumeSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = Resume
        fields = "__all__"
        # Reference: read_only_fields = ["extracted_text1", "extracted_text2", "uploaded_at"]



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_name', 'email']
        # We make email read-only so users can't change their login ID easily
        read_only_fields = ['email']