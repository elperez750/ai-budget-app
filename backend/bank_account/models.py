from django.db import models
from plaid_integration.models import AccessToken

# Create your models here.

class BankAccount(models.Model):
    access_token = models.ForeignKey(AccessToken, on_delete=models.CASCADE, related_name='bank_accounts')
    account_id = models.CharField(max_length=100, unique=True)  # Unique ID for the bank account
    account_name = models.CharField(max_length=255)  # Name of the bank account (e.g., "Checking", "Savings")
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)  # Current balance of the bank account
    available_balance = models.DecimalField(max_digits=10, decimal_places=2)  # Available balance of the bank account
    currency = models.CharField(max_length=10, default='USD')  # Currency of the bank account (default is USD)


    def __str__(self):
        return f"BankAccount({self.account_name}, {self.current_balance})"