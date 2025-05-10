from django.db import models
from plaid_integration.models import AccessToken


# Create your models here.
class Transaction(models.Model):

    Budget = models.ForeignKey('budgets.Budget', on_delete=models.SET_NULL, related_name='transactions', blank=True, null=True)  # Link to Budget
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
    