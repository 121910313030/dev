from django.urls import path
from .views import resume_api

urlpatterns = [
    path('api/resumes', resume_api)
]