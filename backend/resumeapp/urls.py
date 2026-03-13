from django.urls import path
from .views import resume_api
from .login import login_user


urlpatterns = [
    path('api/resumes/', resume_api),
    # path('api/top-candidates/', top_resumes),
    path('login/', login_user),
]