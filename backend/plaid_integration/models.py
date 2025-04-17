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
    
    





