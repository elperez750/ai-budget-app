from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from plaid_service import PlaidService
import logging
import traceback
from .models import AccessToken, BankAccount
from transactions.models import Transaction
from budgets.models import Budget
from rest_framework.permissions import IsAuthenticated
from users.authentication import CookieJWTAuthentication
from django.db import transaction as db_transaction

logger = logging.getLogger(__name__)

plaid_service = PlaidService()

class AccountListView(APIView):
    """
    View to list all accounts.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        """
        List all accounts.
        """
        access_token = request.query_params.get("access_token")
        if not access_token:
            return Response({"error": "Access token is required"}, status=400)
        
        accounts = sync_accounts(access_token)
        return Response(accounts, status=200)




def get_access_token_object(access_token):
    """Get AccessToken object from database given access token string."""
    try:
        return AccessToken.objects.get(access_token=access_token)
    except AccessToken.DoesNotExist:
        logger.error(f"Access token not found: {access_token}")
        return None
    

def sync_accounts(access_token):
    """
    Retrieve account data from Plaid and save to database
    
    Args:
        access_token: The Plaid access token
        
    Returns:
        List of accounts retrieved
    """
    try:
        # Get accounts from Plaid
        account_response = plaid_service.get_accounts(access_token)
        if not account_response:
            # If there's no direct get_accounts method, use sync_transactions first call
            account_response = plaid_service.sync_transactions(access_token)
            
        accounts = account_response.get('accounts', [])
        
        # Get token object once
        access_token_obj = get_access_token_object(access_token)
        if not access_token_obj:
            logger.error(f"No access token object found for token: {access_token}")
            return []
            
        # Process each account
        for account in accounts:
            save_account(account, access_token_obj)
            
        return accounts
    except Exception as e:
        logger.error(f"Error syncing accounts: {e}")
        traceback.print_exc()
        return []


def save_account(account, access_token_obj):
    """
    Save a single account to the database
    
    Args:
        account: Account data from Plaid
        access_token_obj: AccessToken model instance
    """
    try:
        account_id = account.get('account_id', '')
        
        # Skip if account exists
        if BankAccount.objects.filter(account_id=account_id).exists():
            logger.info(f"Account {account_id} already exists. Skipping.")
            return
            
        # Get balance values with proper handling
        available = account.get('balances', {}).get('available')
        current = account.get('balances', {}).get('current', 0)
        
        # Create the account
        BankAccount.objects.create(
            access_token=access_token_obj,
            account_id=account_id,
            account_name=account.get('name', ''),
            current_balance=current,
            available_balance=available if available is not None else 0,
            currency=account.get('balances', {}).get('iso_currency_code', 'USD')
        )
        logger.info(f"Successfully created account: {account.get('name')}")
    except Exception as e:
        logger.error(f"Error saving account {account.get('account_id')}: {e}")
        traceback.print_exc()



    

