from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .plaid_service import PlaidService
import logging
import traceback
from .models import AccessToken, Transaction, Budget, BankAccount
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
    
class SyncTransactionsView(APIView):
    def post(self, request):
        """Sync accounts and transactions from Plaid."""
        access_token = request.data.get("accessToken")
        cursor = request.data.get("cursor", "")
        
        if not access_token:
            return Response({"error": "Missing access_token parameter"}, status=400)
        
        try:
            # First sync accounts
            accounts = sync_accounts(access_token)
            
            # Then sync transactions
            transactions = sync_transactions(access_token, cursor)
            
            # Save the transactions to database
            save_transactions(transactions, access_token)
            
            return Response({
                "message": "Data synced successfully",
                "account_count": len(accounts),
                "transaction_count": len(transactions),
                "accounts": accounts,
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