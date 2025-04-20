from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Budget(models.Model):
    budget_name = models.CharField(max_length=255, default="Untitled")  # Name of the budget (e.g., "Groceries", "Entertainment")
    budget_category = models.CharField(max_length=255)  # Category of the budget (e.g., "Groceries", "Entertainment")
    budget_amount = models.DecimalField(max_digits=15, decimal_places=2)  # Total budget amount for the category
    budget_period = models.CharField(max_length=50)  # Period of the budget (e.g., "monthly", "weekly")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')  # Link to UserProfile
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Budget({self.budget_name}, {self.budget_amount})"
    