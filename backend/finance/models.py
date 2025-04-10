from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class AccessToken(models.Model):
    """
    Model to store the access token and item_id returned by Plaid after exchanging the public token.
    This allows you to associate the access token with a user or account in your system.
    """
    access_token = models.CharField(max_length=100, unique=True)  # Access token from Plaid
    item_id = models.CharField(max_length=100)  # Item ID from Plaid
    user_profile = models.ForeignKey(User, on_delete=models.CASCADE, related_name='access_tokens')  # Link to UserProfile
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the access token was created
    cursor = models.CharField(max_length=255, blank=True, null=True)  # Cursor for pagination (optional)


    def __str__(self):
        return f"AccessToken({self.access_token})"
    
    


class Transaction(models.Model):

    
    access_token = models.ForeignKey(AccessToken, on_delete=models.CASCADE, related_name='transactions')  # Link to AccessToken
    name = models.CharField(max_length=255)  # Name of the transaction (e.g., merchant name)
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Amount of the transaction
    date = models.DateField()  # Date of the transaction (YYYY-MM-DD)
    logo_url = models.URLField(max_length=255, blank=True, null=True)  # URL of the merchant's icon
    category = models.CharField(max_length=255, blank=True, null=True)  # Category of the transaction (e.g., groceries, dining)
    currency = models.CharField(max_length=10, default='USD')  # Currency of the transaction (default is USD)
    transaction_id = models.CharField(max_length=100, unique=True)  # Unique transaction ID from Plaid

    def __str__(self):
        """
        String representation of the Transaction object for easier debugging and logging.
        """
        return f"Transaction(name={self.name}, amount={self.amount}, date={self.date}, transaction_id={self.transaction_id})"
    
class Budget(models.Model):
    budget_category = models.CharField(max_length=255)  # Name of the budget (e.g., "Groceries", "Entertainment")
    budget_amount = models.DecimalField(max_digits=10, decimal_places=2)  # Total budget amount for the category
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')  # Link to UserProfile
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Budget({self.budget_name}, {self.budget_amount})"
    

class BankAccount(models.Model):
    access_token = models.ForeignKey(AccessToken, on_delete=models.CASCADE, related_name='bank_accounts')
    account_id = models.CharField(max_length=100, unique=True)  # Unique ID for the bank account
    account_name = models.CharField(max_length=255)  # Name of the bank account (e.g., "Checking", "Savings")
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)  # Current balance of the bank account
    available_balance = models.DecimalField(max_digits=10, decimal_places=2)  # Available balance of the bank account
    currency = models.CharField(max_length=10, default='USD')  # Currency of the bank account (default is USD)


    def __str__(self):
        return f"BankAccount({self.account_name}, {self.current_balance})"