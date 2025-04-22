from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.authentication import CookieJWTAuthentication
from .models import Budget
from rest_framework import status

# Create your views here.
class BudgetListView(APIView):
    """
    View to list all budgets.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self):
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
        

class BudgetDeleteView(APIView):

    def delete(self, request):


        budget_id = request.query_params["budgetId"]

        budget = Budget.objects.get(id=budget_id)
        budget.delete()

        return Response({"message": "Budget deleted successfully"}, status=200)
    

class BudgetUpdateView(APIView):
    def put(self, request):
        data = request.data
        budget_id = data.get("budgetId")

        try:
            budget_data = data.get("budget")
            budget = Budget.objects.get(id=budget_id)

            budget.budget_name = budget_data.get("budgetName")
            budget.budget_amount = budget_data.get("budgetAmount")
            budget.budget_period = budget_data.get("budgetPeriod")
            budget.budget_category = budget_data.get("budgetCategory")
            budget.save()

            # Manually make the object JSON serializable
            response_data = {
                "budgetId": budget.id,
                "budgetName": budget.budget_name,
                "budgetAmount": float(budget.budget_amount),
                "budgetPeriod": budget.budget_period,
                "budgetCategory": budget.budget_category,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Budget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)

    