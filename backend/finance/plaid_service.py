import plaid
from plaid.api import plaid_api
from dotenv import load_dotenv
import os
#Link token imports
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.sandbox_item_fire_webhook_request import SandboxItemFireWebhookRequest
from plaid.model.transactions_refresh_request import TransactionsRefreshRequest
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.webhook_type import WebhookType
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.transactions_sync_response import TransactionsSyncResponse

load_dotenv()





class PlaidService:

    def __init__(self):
        client_id = os.getenv("PLAID_CLIENT_ID")
        secret = os.getenv("PLAID_SECRET")
        configuration = plaid.Configuration(
            host=plaid.Environment.Sandbox, # Use Sandbox for testing purposes
            api_key={
                'clientId': client_id, # Replace with your Plaid client ID
                'secret': secret, # Replace with your Plaid secret
            }
        )

        self.client = plaid_api.PlaidApi(plaid.ApiClient(configuration))


    def create_link_token(self, user_id):
        """
        Creates a link token for initiating the Plaid Link flow. This token is used to securely connect a user's bank account.
        :param user_id: Unique identifier for the user in your system (e.g., database ID).
        :return: A dictionary containing the link token and other relevant information.
        """
        request = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(client_user_id=str(user_id)), # Unique identifier for the user in your system
            client_name = "ai-budgeting-app",
            products=[Products('transactions')], # The products you want to use (transactions, balance, etc.)
            country_codes=[CountryCode("US")], # The country codes you want to support (US, GB, etc.)
            language="en",
            webhook="https://df3e-88-162-5-123.ngrok.io/api/finance/webhook/"

        )

        response = self.client.link_token_create(request)
        response_dict = response.to_dict()
        link_token = response_dict.get('link_token')

        return link_token
    

    def exchange_public_token(self, public_token):
        """
        Exchanges a public token for an access token.
        :param public_token: The public token generated by the Plaid Link flow.
        :return: Access token from Plaid.
        """
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        response = self.client.item_public_token_exchange(exchange_request)
        response_dict = response.to_dict()
        return {
    'access_token': response_dict.get('access_token'),
    'item_id': response_dict.get('item_id')
}


    def simulate_transactions(self, access_token):
        webhook_request = SandboxItemFireWebhookRequest(
            access_token=access_token,
            webhook_code="DEFAULT_UPDATE",
            webhook_type=WebhookType("TRANSACTIONS")
        )
        self.client.sandbox_item_fire_webhook(webhook_request)


    def sync_transactions(self, access_token, cursor=""):
        request = TransactionsSyncRequest(
            access_token=access_token,
            cursor=cursor # Optional: Use a cursor to paginate through results. If None, it will start from the beginning.
        )


        response = self.client.transactions_sync(request)
        return response.to_dict()  # Returns the full response as a dictionary, which includes the transactions and a new cursor if available.
