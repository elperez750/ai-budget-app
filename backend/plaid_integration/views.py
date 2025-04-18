from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from plaid_service import PlaidService
import logging
import traceback
from .models import AccessToken
from transactions.models import Transaction
from budgets.models import Budget
from bank_account.models import BankAccount
from rest_framework.permissions import IsAuthenticated
from users.authentication import CookieJWTAuthentication
from django.db import transaction as db_transaction

logger = logging.getLogger(__name__)

plaid_service = PlaidService()

def get_access_token_object(access_token):
    """Get AccessToken object from database given access token string."""
    try:
        return AccessToken.objects.get(access_token=access_token)
    except AccessToken.DoesNotExist:
        logger.error(f"Access token not found: {access_token}")
        return None
    
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
        """Exchange public token for access token and store it."""
        public_token = request.data.get("publicToken")
        
        try:
            exchange_data = plaid_service.exchange_public_token(public_token)
     
            access_token = exchange_data.get('access_token', None)
            item_id = exchange_data.get('item_id', None)
            cursor = exchange_data.get('cursor', None)
            
            # Create access token record
            AccessToken.objects.create(
                access_token=access_token, 
                item_id=item_id, 
                user_profile=request.user, 
                cursor=cursor
            )
    
            return Response({
                'access_token': access_token,
                "item_id": item_id
            })
        except Exception as e:
            logger.error(f"Error exchanging public token: {e}")
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)
    
class CheckAccessTokenView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Check if authenticated user has an access token."""
        try:
            token_obj = AccessToken.objects.get(user_profile=request.user)
            logger.info(f"Access token found for user: {request.user.id}")
            return Response({"access_token": token_obj.access_token})
        except AccessToken.DoesNotExist:
            return Response({"access_token": None}, status=404)
    
class SimulateTransactionsView(APIView):
    def post(self, request):
        """Simulate transaction webhook for testing."""
        access_token = request.data.get("accessToken")
        
        if not access_token:
            return Response({"error": "Missing access_token parameter"}, status=400)

        try:
            plaid_service.simulate_transactions(access_token)
            return Response({
                "message": "Simulated transaction webhook fired successfully."
            }, status=200)
        except Exception as e:
            logger.error(f"Error simulating transactions: {e}")
            traceback.print_exc()
            return Response({"error": "Internal server error"}, status=500)
        
class PlaidWebhookView(APIView):
    def post(self, request):
        """Handle webhooks from Plaid."""
        logger.info("Received webhook: %s", request.data)
        return Response(status=200)
    


