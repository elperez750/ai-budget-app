from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.
class SignUpView(APIView):
    def post(self, request):

        # Get username and password passed in from the request
        # We get this after we submit form on the front end
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # We have to check if the user is already in the database
        # If the user is not in the database, then we need to send a response that the user exists
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)



class LogOutView(APIView):
    def post(self, request):
       
       #setting up the response to send to user
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        
        # Clear the authentication cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response



class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        #Check if the user exists in the database
        user = authenticate(username=username, password=password)



        if user is not None:
            #Creating refresh and access tokens for user
            refresh = RefreshToken.for_user(user)



            #Custom response message

            #The reason we do user.email is because we did not pass in the email in the request.
            #so when we authenticate, we basically return all attributes of user, including email
            response_data = {
                "message": "Login successful",
                "username": username,
                "email": user.email,
            }


            #set the response_data to the response we will sent to user
            response = Response(response_data, stautus=status.HTTP_200_OK)


            #Setting access token in cookies for user
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=60 * 30,
            )


            #Setting refresh token in cookies to user
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=3600 * 24 * 7,
            )

            #Finally returning the response
            return response

        #this is if the user is not in the database, meaning that there was either invalid credentials or user doesn't exist
        else:
            return Response(
                {"message": "Invalud credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )


class CookieTokenRefreshView(APIView):
    def post(self, request):

        #getting the refresh token
        refresh_token = request.COOKIES.get("refresh_token")

        #This basically means that we are not logged in
        if not refresh_token:
            return Response({"details": "Refresh token not found"}, status=401)
        #If we have a refresh token,  then we will use it to get a new access token
        try:
            # Validate the refresh token
            refresh = RefreshToken(refresh_token)

            # Create new access token
            access_token = str(refresh.access_token)

            # Create response
            response = Response({"detail": "Token refreshed successfully"})

            # Set new access token cookie
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,  # Set to True in production
                samesite="Lax",
                max_age=60 * 30,  # 30 minutes
            )

            return response

        except TokenError:
            # Token is invalid or expired
            return Response({"detail": "Invalid or expired token"}, status=401)
