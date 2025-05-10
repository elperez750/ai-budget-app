from django.urls import path
from . import views

urlpatterns = [
    path('', views.AccountListView.as_view(), name='account_list'),
    path('fetch_bank_accounts_from_db/', views.GetAccountFromDBView.as_view(), name='fetch_bank_accounts_from_db'),
    path('sync_bank_accounts/', views.SyncBankAccountsView.as_view(), name='sync_bank_accounts'),
]


