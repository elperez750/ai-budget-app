from django.urls import path
from .views import SignUpView, LoginView, CookieTokenRefreshView, LogOutView, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', CookieTokenRefreshView.as_view(), name="token_refresh"),
    path('logout/', LogOutView.as_view(), name="logout"),
    path('me/', UserProfileView.as_view(), name='user_view')
]


