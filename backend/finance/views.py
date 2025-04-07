from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .plaid_service import PlaidService
import logging
import traceback
from .models import AccessToken
from rest_framework.permissions import IsAuthenticated
from users.authentication import CookieJWTAuthentication



logger = logging.getLogger(__name__)

plaid_service = PlaidService()

class CreateLinkTokenView(APIView):
    """
    View to create a Plaid link token for the frontend to use.
    """
    def post(self, request):
        """
        Handle POST request to create a link token.
        :param request: The incoming request containing user data.
        :return: JSON response with the link token or an error message.
        """
        
        user_id = request.data.get("user_id")
        logger.info(f"Creating link token for user_id: {user_id}")

        # Call the plaid service to create a link token        
        try:
            link_token = plaid_service.create_link_token(str(user_id))
            return Response({"linkToken": link_token}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

class ExchangePublicTokenView(APIView):
    def post(self, request):
        public_token = request.data.get("publicToken")

        exchange_data = plaid_service.exchange_public_token(public_token)
 


        access_token = exchange_data.get('access_token', None)
        item_id = exchange_data.get('item_id', None)

        AccessToken.objects.create(access_token=access_token, item_id=item_id, user_profile=request.user)  # Assuming you have a user in request, e.g., from authentication)




        return Response({
            'access_token': access_token,
            "item_id": item_id # item_id can be used to identify the item in Plaid
        })
    
class CheckAccessTokenView(APIView):
    authentication_classes = [CookieJWTAuthentication]  # Ensure this view uses JWT authentication to get the user
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        try:
            token_obj = AccessToken.objects.get(user_profile=request.user)  # Get the access token for the authenticated user
            print("Access token found for user:", request.user.id)  # Debugging line to check if the user is correct
            return Response({"access_token": token_obj.access_token})
        except AccessToken.DoesNotExist:
            return Response({"access_token": None}, status=404)
    


class SimulateTransactionsView(APIView):
    def post(self, request):
        access_token = request.data.get("accessToken")
        print("Received access_token:", access_token)

        if not access_token:
            return Response({"error": "Missing access_token parameter"}, status=400)

        try:
            # Call the method to simulate transactions
            plaid_service.simulate_transactions(access_token)

            return Response({
                "message": "Simulated transaction webhook fired successfully."
            }, status=200)
        except Exception as e:
            print("Error simulating transactions:", e)
            traceback.print_exc()  # 👈 prints full traceback to the terminal
            return Response({"error": "Internal server error"}, status=500)
        

class PlaidWebhookView(APIView):
    def post(self, request):
        print("Received webhook:", request.data)
        return Response(status=200)
    

class SyncTransactionsView(APIView):
    def post(self, request):
        access_token = request.data.get("accessToken")
        cursor = request.data.get("cursor", "")
    
        if not access_token:
            return Response({"error": "Missing access_token parameter"}, status=400)
        
        else:
            try:
                transactions = plaid_service.sync_transactions(access_token, cursor=cursor)
                return Response(transactions, status=200)
            
            except Exception as e:
                print("Error syncing transactions", str(e))
                return Response({"error": str(e)}, status=500)
            
            

    