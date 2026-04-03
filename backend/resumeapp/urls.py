from django.urls import path
from .views import resume_api, batch_list_api, resume_detail_api
from .login import login_user
from .signup import signup_user
from .adminuser import admin_overview
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/resumes/', resume_api),
    path('api/resumes/<int:pk>/', resume_detail_api),

    path('signup/', signup_user),
    path('api/batches/', batch_list_api, name='batch-list'),

    path('login/', login_user, name='manual_login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/admin/overview/', admin_overview, name='admin-overview'),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)