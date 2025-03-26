from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import  TokenError


# Create your views here.
class SignUpView(APIView):
    def post(self, request):

        #Get username and password passed in from the request
        #We get this after we submit form on the front end
        username = request.data.get("username");
        email = request.data.get("email")
        password = request.data.get("password")

        
        #We have to check if the user is already in the database
        #If the user is not in the database, then we need to send a response that the user exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)


        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
    
   


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            # Return a short error message
            return Response(str(e), status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)