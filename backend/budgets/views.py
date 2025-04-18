from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.authentication import CookieJWTAuthentication
from .models import Budget


# Create your views here.
class BudgetListView(APIView):
    """
    View to list all budgets.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        """
        List all budgets.
        """
        budgets = Budget.objects.all()
        return Response(budgets.values())
    


class BudgetCreateView(APIView):
    def post(self, request):
        """
        Create a new budget.
        """
        print("the request", request.data)
        budget_object = request.data

        name = budget_object["budget"]["budget_name"]

        amount = budget_object["budget"]["budget_amount"]

        period = budget_object["budget"]["budget_period"]
        category = budget_object["budget"]["budget_category"]
        user = request.user

        budget = Budget.objects.create(budget_name=name, budget_amount=amount, user=user, budget_period=period, budget_category=category)
        return Response({"name": budget.budget_name, "amount": budget.budget_amount}, status=201)
    

class BudgetFetchView(APIView):

    def get(self, request):
        """
        Fetch a specific budget by ID.
        """
        user_id = request.query_params["userId"]
        budget = Budget.objects.filter(user=user_id).values()
        return Response(budget, status=200)
        