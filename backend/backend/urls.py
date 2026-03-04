from django.contrib import admin
from django.urls import path, include

import resumeapp

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('resumeapp.urls')),
]