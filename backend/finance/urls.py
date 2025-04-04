from django.urls import path
from .views import CreateLinkTokenView, ExchangePublicTokenView, SimulateTransactionsView, PlaidWebhookView, SyncTransactionsView

urlpatterns = [
    path('create_link_token/', CreateLinkTokenView.as_view()),
    path('exchange_public_token/', ExchangePublicTokenView.as_view()),
    path('simulate_transactions/', SimulateTransactionsView.as_view()),
    path('webhook/', PlaidWebhookView.as_view(), name='plaid-webhook'),
    path('sync_transactions/', SyncTransactionsView.as_view(), name='sync-transactions'),

]