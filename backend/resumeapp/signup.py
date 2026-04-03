from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

# Helper to generate tokens immediately after signup
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(["POST"])
@permission_classes([AllowAny])
def signup_user(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    # 1. Basic Validation
    if not email or not password:
        return Response(
            {"status": False, "message": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    User = get_user_model()

    # 2. Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response(
            {"status": False, "message": "A user with this email already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # 3. Create the User
        # Use create_user (not create) because it handles password hashing automatically
        user = User.objects.create_user(
            email=email,
            password=password
        )
        
        # 4. Generate Tokens so they are logged in immediately
        tokens = get_tokens_for_user(user)

        return Response({
            "status": True,
            "message": "User registered successfully",
            "tokens": tokens,
            "user": {
                "id": user.id,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"status": False, "message": f"Error creating user: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )