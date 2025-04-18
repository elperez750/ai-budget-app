from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from plaid_service import PlaidService
import logging
import traceback
from .models import AccessToken, Transaction
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
    

def sync_transactions(access_token, cursor=""):
    """
    Retrieve all transactions from Plaid by handling pagination
    
    Args:
        access_token: The Plaid access token
        cursor: Starting point for pagination (optional)
    
    Returns:
        List of added transactions
    """
    all_added_transactions = []
    
    # Initial sync call
    sync_result = plaid_service.sync_transactions(access_token, cursor)
    
    # Process first batch of transactions
    all_added_transactions.extend(sync_result.get('added', []))
    cursor = sync_result.get('next_cursor')
    has_more = sync_result.get('has_more', False)
    
    # Continue fetching if there are more transactions
    while has_more and cursor:
        sync_result = plaid_service.sync_transactions(access_token, cursor)
        all_added_transactions.extend(sync_result.get('added', []))
        cursor = sync_result.get('next_cursor')
        has_more = sync_result.get('has_more', False)
    
    # Update the cursor in the database
    access_token_object = get_access_token_object(access_token)
    if access_token_object:
        access_token_object.cursor = cursor
        access_token_object.save()
    
    return all_added_transactions


@db_transaction.atomic
def save_transactions(transactions, access_token):
    """
    Save multiple transactions to database efficiently
    
    Args:
        transactions: List of transaction data from Plaid
        access_token: The Plaid access token
    """
    access_token_object = get_access_token_object(access_token)
    if not access_token_object:
        logger.error("Access token object not found")
        return
        
    bulk_transactions = []
    for transaction in transactions:
        transaction_id = transaction.get('transaction_id', '')
        
        # Skip if transaction exists
        if Transaction.objects.filter(transaction_id=transaction_id).exists():
            logger.info(f"Transaction {transaction_id} already exists. Skipping.")
            continue
            
        # Create transaction object (not saved yet)
        bulk_transactions.append(Transaction(
            access_token=access_token_object,
            name=transaction.get('name', ''),
            amount=transaction.get('amount', 0),
            date=transaction.get('date'),
            logo_url=transaction.get('logo_url', ''),
            category=','.join(transaction.get('category', [])) if isinstance(transaction.get('category'), list) else transaction.get('category', ''),
            currency=transaction.get('iso_currency_code', 'USD'),
            transaction_id=transaction_id
        ))
        
    # Save all transactions in one database query if any exist
    if bulk_transactions:
        Transaction.objects.bulk_create(bulk_transactions)
        logger.info(f"Saved {len(bulk_transactions)} new transactions")




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
        



class SyncTransactionsView(APIView):
    def post(self, request):
        """Sync accounts and transactions from Plaid."""
        access_token = request.data.get("accessToken")
        cursor = request.data.get("cursor", "")
        
        if not access_token:
            return Response({"error": "Missing access_token parameter"}, status=400)
        
        try:
            # First sync accounts
            
            # Then sync transactions
            transactions = sync_transactions(access_token, cursor)
            
            # Save the transactions to database
            save_transactions(transactions, access_token)
            
            return Response({
                "message": "Data synced successfully",
                "transaction_count": len(transactions),
                "transactions": transactions
            }, status=200)
        except Exception as e:
            logger.error(f"Error syncing data: {e}")
            traceback.print_exc()
            return Response({"error": f"Internal server error: {str(e)}"}, status=500)
        


class FetchTransactionsFromDBView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Fetch transactions from the database."""
        access_token = request.query_params.get("accessToken")
        
        if not access_token:
            return Response({"error": "Missing access_token parameter"}, status=400)
           
        try: 
            token_obj = get_access_token_object(access_token)
            if not token_obj:
                return Response({"error": "Invalid access token"}, status=400)
                
            user_transactions = Transaction.objects.filter(access_token=token_obj).values()
            user_accounts = BankAccount.objects.filter(access_token=token_obj).values()
            return Response({"transactions": user_transactions, "accounts": user_accounts}, status=200)
        
        except Exception as e:
            logger.error(f"Error fetching transactions: {e}")
            traceback.print_exc()
            return Response({"error": "Internal server error"}, status=500)