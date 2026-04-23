from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


# Helper function to generate tokens
def get_tokens_for_user(user):
    """
    Manually creates a Refresh and Access token for the user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(["POST"])
@permission_classes([AllowAny]) 
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print(email, password)

    # Basic validation to ensure both fields are present
    if not email or not password:
        return Response(
            {"status": False, "message": "Both email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user_model = get_user_model()
    
    try:
        # 1. Check if the user exists in the database
        user_record = user_model.objects.filter(email=email).first()
        
        if not user_record:
            return Response(
                {"errorType": "email", "status": False, "message": "No account found with this email."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # 2. Authenticate the password
        # Since you set USERNAME_FIELD = 'email' in models.py, 
        # 'authenticate' expects the email in the 'username' parameter.
        user = authenticate(request, username=email, password=password)

        if user is not None:
            if user.is_active:
                tokens = get_tokens_for_user(user)
                return Response({
                    "status": True,
                    "message": "Login successful",
                    "tokens": tokens,
                    "user_id": user.id,
                    "email": user.email
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"status": False, "message": "This account has been disabled."},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            # Email exists but password didn't match
            return Response(
                {"errorType": "password", "status": False, "message": "Incorrect password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

    except Exception:
        # Log the error for debugging if needed: print(e)
        return Response(
            {"status": False, "message": "An internal server error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )