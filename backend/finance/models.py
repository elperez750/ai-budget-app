from django.db import models
from django.contrib.auth.models import UserProfile
# Create your models here.
class Transaction(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    transaction_id = models.CharField(max_length=100, unique=True)  # Unique identifier for the transaction
    account_id = models.CharField(max_length=100)  # Account associated with the transaction