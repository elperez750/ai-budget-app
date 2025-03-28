from django.urls import path
from .views import SignUpView, LoginView, CookieTokenRefreshView, LogOutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name="token_refresh"),
    path('logout/', LogOutView.as_view(), name="logout")
]


