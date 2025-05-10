from django.urls import path
from . import views

urlpatterns = [
    path('create_link_token/', views.CreateLinkTokenView.as_view(), name='create_link_token'),
    path('exchange_public_token/', views.ExchangePublicTokenView.as_view(), name='exchange_public_token'),
    path('has_token/', views.CheckAccessTokenView.as_view(), name='has_access_token'),
]


