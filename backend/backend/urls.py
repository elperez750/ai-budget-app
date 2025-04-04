from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include("users.urls")),
    path('api/finance/', include("finance.urls")),  # Include finance URLs, if you have a finance app
]
