from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate


@api_view(["POST"])
def login_user(request):

    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username = email, password = password)

    if user:
        return Response({"message": "Login successful"})
    
    return Response({"message": "Invalid credentials"},status = 401)
