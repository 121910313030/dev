from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import update_session_auth_hash
from django.core.exceptions import ValidationError
from .serializer import UserProfileSerializer



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_detail(request):
    user = request.user
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    current_pw = request.data.get("current_password")
    new_pw = request.data.get("new_password")

    # 1. Check if current password is correct
    if not user.check_password(current_pw):
        return Response({"error": "Incorrect current password"}, status=400)

    # 2. Validate and set new password
    user.set_password(new_pw)
    user.save()

    # 3. Important: Keep the user logged in (updates the session hash)
    from django.contrib.auth import update_session_auth_hash
    update_session_auth_hash(request, user)
    
    return Response({"message": "Password updated successfully"})



@api_view(['PATCH'])
def update_settings(request):
    return Response({"message": "Settings updated"})