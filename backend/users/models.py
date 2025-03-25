from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Add your custom fields
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return f"Username: {self.user.username} Email: {self.user.email} "