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


def get_access_token_object(access_token):
    try:
        return AccessToken.objects.get(access_token=access_token)
    except AccessToken.DoesNotExist:
        logger.error(f"Access token not found: {access_token}")
        return None


def save_account(account, access_token_obj):
    try:
        account_id = account.get('account_id', '')
        if BankAccount.objects.filter(account_id=account_id).exists():
            logger.info(f"Account {account_id} already exists. Skipping.")
            return

        balances = account.get('balances', {})
        BankAccount.objects.create(
            access_token=access_token_obj,
            account_id=account_id,
            account_name=account.get('name', ''),
            current_balance=balances.get('current', 0),
            available_balance=balances.get('available') or 0,
            currency=balances.get('iso_currency_code', 'USD')
        )
        logger.info(f"Account {account.get('name')} saved successfully.")
    except Exception as e:
        logger.error(f"Error saving account {account.get('account_id')}: {e}")
        traceback.print_exc()


def sync_accounts_logic(access_token):
    try:
        account_response = plaid_service.get_accounts(access_token)
        accounts = account_response.get('accounts', [])

        access_token_obj = get_access_token_object(access_token)
        if not access_token_obj:
            return []

        for account in accounts:
            save_account(account, access_token_obj)

        return accounts
    except Exception as e:
        logger.error(f"Error syncing accounts: {e}")
        traceback.print_exc()
        return []


class AccountListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        access_token = request.query_params.get("accessToken")
        if not access_token:
            return Response({"error": "Access token is required"}, status=400)

        accounts = sync_accounts_logic(access_token)
        
        # Convert to frontend format
        bank_accounts = []
        for account in accounts:
            bank_accounts.append({
                "accessToken": access_token,
                "accountId": account.get("account_id", ""),
                "accountName": account.get("name", ""),
                "currentBalance": account.get("balances", {}).get("current", 0),
                "availableBalance": account.get("balances", {}).get("available", 0) or 0,
                "currency": account.get("balances", {}).get("iso_currency_code", "USD")
            })
            
        return Response({"bankAccounts": bank_accounts}, status=200)
    
class SyncBankAccountsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def post(self, request):
        print("=== SyncBankAccountsView CALLED ===")
        print("Request data:", request.data)
        data = request.data
        access_token = data.get("accessToken")
        print("Access token from data:", access_token)
        if not access_token:
            return Response({"error": "Access token is required"}, status=400)

        try:
            with db_transaction.atomic():
                plaid_accounts = sync_accounts_logic(access_token)
                
                # Convert snake_case to camelCase for frontend compatibility
                bank_accounts = []
                for account in plaid_accounts:
                    bank_accounts.append({
                        "accessToken": access_token,
                        "accountId": account.get("account_id", ""),
                        "accountName": account.get("name", ""),
                        "currentBalance": account.get("balances", {}).get("current", 0),
                        "availableBalance": account.get("balances", {}).get("available", 0) or 0,
                        "currency": account.get("balances", {}).get("iso_currency_code", "USD")
                    })
                
                return Response({"bankAccounts": bank_accounts}, status=201)
        except Exception as e:
            logger.error(f"Error creating account: {e}")
            traceback.print_exc()
            return Response({"error": "Internal server error"}, status=500)
 



class GetAccountFromDBView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("=== GetAccountFromDBView CALLED ===")
        print("Query params:", request.query_params)
        access_token = request.query_params.get("accessToken")
        print("Access token from params:", access_token)
        if not access_token:
            return Response({"error": "Access token is required"}, status=400)

        try:
            access_token_obj = get_access_token_object(access_token)
            if not access_token_obj:
                return Response({"error": "Access token not found"}, status=404)

            accounts_queryset = BankAccount.objects.filter(access_token=access_token_obj).values()
            
            # Convert snake_case to camelCase for frontend compatibility
            bank_accounts = []
            for account in accounts_queryset:
                bank_accounts.append({
                    
                    "accessToken": access_token,
                    "accountId": account["account_id"],
                    "accountName": account["account_name"],
                    "currentBalance": float(account["current_balance"]),
                    "availableBalance": float(account["available_balance"]),
                    "currency": account["currency"]
                })
            
            return Response({"bankAccounts": bank_accounts}, status=200)
        
        except Exception as e:
            logger.error(f"Error fetching accounts: {e}")
            traceback.print_exc()
            return Response({"error": "Internal server error"}, status=500)