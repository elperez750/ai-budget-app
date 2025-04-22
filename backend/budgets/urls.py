from django.urls import path
from . import views

urlpatterns = [
    path('', views.BudgetListView.as_view(), name='budget_list'),
    path('create_budget/', views.BudgetCreateView.as_view(), name='budget_create'),
    path('fetch_budgets/', views.BudgetFetchView.as_view(), name='fetch_budget'),
    path('delete_budget/', views.BudgetDeleteView.as_view(), name='delete_budget'),
    path('update_budget/', views.BudgetUpdateView.as_view(), name='update_budget'),
]


