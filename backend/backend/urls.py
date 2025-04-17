from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include("users.urls")),
    path('api/transactions/', include("transactions.urls")),  # Include transactions URLs, if you have a transactions app
    path('api/budgets', include("budgets.urls")),  # Include budgets URLs, if you have a budgets app
    path('api/bank_accounts', include("bank_account.urls")),  # Include bank accounts URLs, if you have a bank accounts app
    
]
