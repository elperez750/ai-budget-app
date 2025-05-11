from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from users.authentication import CookieJWTAuthentication

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": not bool(os.getenv("DEBUG", "False").lower() == "true"),
    "samesite": "Lax",
    "path": "/"
}

class SignUpView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"message": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        response = Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_200_OK)

        response.set_cookie("access_token", str(refresh.access_token), max_age=1800, **COOKIE_SETTINGS)
        response.set_cookie("refresh_token", str(refresh), max_age=604800, **COOKIE_SETTINGS)

        return response


class LogOutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class UserProfileView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })


class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token not found"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"detail": "Token refreshed successfully"})
            response.set_cookie("access_token", access_token, max_age=1800, **COOKIE_SETTINGS)
            return response

        except TokenError:
            return Response({"detail": "Invalid or expired token"}, status=401)
