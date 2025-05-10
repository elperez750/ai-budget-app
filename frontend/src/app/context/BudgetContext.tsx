import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { BudgetsApi } from "../../utils/BudgetsApi";
import { BudgetContextType, BudgetType } from "../types/BudgetTypes";
import { useAuth } from "./AuthContext";

// ✅ Define a reusable input type for forms and API
export type BudgetInputType = Omit<BudgetType, "budgetId">;

// ✅ API → Frontend mapping
export const mapBudgetFromApi = (budget: any): BudgetType => ({
  budgetId: budget.id,
  budgetName: budget.budget_name,
  budgetAmount: parseFloat(budget.budget_amount),
  budgetPeriod: budget.budget_period,
  budgetCategory: budget.budget_category,
});



// ✅ Frontend → API mapping
export const mapBudgetToApi = (budget: BudgetInputType) => ({
  budget_name: budget.budgetName,
  budget_amount: budget.budgetAmount,
  budget_period: budget.budgetPeriod,
  budget_category: budget.budgetCategory,
});

// Create the context with default values
const BudgetContext = createContext<BudgetContextType>({
  budgets: [],
  isLoading: false,
  error: null,
  fetchBudgets: async () => {},
  createBudget: async () => {},
  deleteBudget: async () => {},
  updateBudget: async () => {},
} );

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Fetch all budgets
  const fetchBudgets = useCallback(async () => {
    if (!user) {
      console.error("User is not authenticated or user ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data: any = await BudgetsApi.fetchBudgets(user.id);
      const mappedBudgets = data.map(mapBudgetFromApi);
      setBudgets(mappedBudgets);
    } catch (err) {
      setError("Failed to fetch budgets");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 🧾 Create new budget
  const createBudget = useCallback(
    async (budgetData: BudgetInputType) => {
      if (!user) {
        console.error("User is not authenticated or user ID is missing");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const newBudget = await BudgetsApi.createNewBudget(
          user.id,
          mapBudgetToApi(budgetData)
        );
        console.log("New budget created:", newBudget);
        await fetchBudgets(); // Refresh budgets after creation
      } catch (err) {
        setError("Failed to create budget");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [user, fetchBudgets]
  );

  // 🗑️ Delete budget
  const deleteBudget = async (budgetId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await BudgetsApi.deleteBudget(budgetId);
      setBudgets((prev) => prev.filter((b) => b.budgetId !== budgetId));
    } catch (err) {
      setError("Failed to delete budget");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBudget = async(budgetId: number, budget: Partial<BudgetType>) => {
    setIsLoading(true);
    setError(null);

    try{
      const updatedBudget: any = await BudgetsApi.updateBudget(budgetId, budget);
      setBudgets((prev) =>
        prev.map((budget) => (budget.budgetId === budgetId ? { ...budget, ...updatedBudget } : budget))
      );
    }
    catch (err) {
      setError("Failed to update budget");
      console.error(err);
    } finally {
      setIsLoading(false);
    }


  }

  // 🪄 Load budgets when user is authenticated
  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user, fetchBudgets]);

  const contextValue: BudgetContextType = {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    createBudget,
    deleteBudget,
    updateBudget,
  };

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
}

// 🎯 Custom hook to use the context
export const useBudget = () => useContext(BudgetContext);
