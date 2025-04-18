from django.urls import path
from . import views

app_name = 'transactions'

urlpatterns = [
  
    # Transaction syncing and simulation endpoints
    path('sync_transactions/', views.SyncTransactionsView.as_view(), name='sync_transactions'),
    path('simulate_transactions/', views.SimulateTransactionsView.as_view(), name='simulate_transactions'),
    path('fetch_transactions_from_db/', views.FetchTransactionsFromDBView.as_view(), name='fetch_transactions'),

]


