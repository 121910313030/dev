from django.urls import path
from .views import resume_api,batch_list_api
from .login import login_user
from .signup import signup_user


urlpatterns = [
    path('api/resumes/', resume_api),
    path('login/', login_user),
    path('signup/', signup_user),
    path('api/batches/', batch_list_api, name='batch-list'),
]