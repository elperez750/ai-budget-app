from django.urls import path
from .views import CreateLinkTokenView, ExchangePublicTokenView, SimulateTransactionsView, PlaidWebhookView, SyncTransactionsView, CheckAccessTokenView

urlpatterns = [
    path('create_link_token/', CreateLinkTokenView.as_view()),
    path('exchange_public_token/', ExchangePublicTokenView.as_view()),
    path('simulate_transactions/', SimulateTransactionsView.as_view()),
    path('webhook/', PlaidWebhookView.as_view(), name='plaid-webhook'),
    path('sync_transactions/', SyncTransactionsView.as_view(), name='sync-transactions'),
    path('has_token/', CheckAccessTokenView.as_view(), name='check-access-token'),  # Added for checking if user has an access token
]