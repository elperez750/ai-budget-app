import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import { BudgetsApi } from "../../utils/BudgetsApi";
import { BudgetContextType } from "../types/BudgetTypes";
import { BudgetType } from "../types/BudgetTypes"; // Import your Budget type
import { useAuth } from "./AuthContext";
// Define types for your budget data

// Create the context with default values
const BudgetContext = createContext<BudgetContextType>({
  budgets: [],
  isLoading: false,
  error: null,
  fetchBudgets: async () => {},
  createBudget: async () => {},
  //updateBudget: async () => {},
  //deleteBudget: async () => {}
});

// Provider component
export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Get the user from AuthContext, ensure user is authenticated
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all budgets

  
  const fetchBudgets = async () => {
    setIsLoading(true);
    setError(null);
    

    if (!user) {
      console.error("User is not authenticated or user ID is missing");
      return;
  }

    try {
      const data: any = await BudgetsApi.fetchBudgets(user.id);
      setBudgets(data);
    } catch (err) {
      setError("Failed to fetch budgets");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }


  // Create new budget
  const createBudget = useCallback(async (budgetData: Omit<BudgetType, "id">) => {
    setIsLoading(true);
    setError(null);

    if (!user) {
        console.error("User is not authenticated or user ID is missing");
        return;
    }

    try {
      const newBudget: any = await BudgetsApi.createNewBudget(user.id, budgetData);
      await fetchBudgets()
      console.log("New budget created:", newBudget);
    } catch (err) {
      setError("Failed to create budget");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchBudgets] )// Add user as a dependency

  /*
  // Update existing budget
  const updateBudget = async (id: string, budgetData: Partial<Budget>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedBudget = await BudgetApi.updateBudget(id, budgetData);
      setBudgets(budgets.map(budget => 
        budget.id === id ? updatedBudget : budget
      ));
    } catch (err) {
      setError("Failed to update budget");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  */

  /*

  // Delete budget
  const deleteBudget = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await BudgetApi.deleteBudget(id);
      setBudgets(budgets.filter(budget => budget.id !== id));
    } catch (err) {
      setError("Failed to delete budget");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
*/

  // Load budgets on first render
  useEffect(() => {
    //fetchBudgets();
    console.log("Hello there from the budgets context");
  }, []);

  // Create the context value
  const contextValue = {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    createBudget,
    //updateBudget,
    // deleteBudget
  };

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
}

// Custom hook to use the budget context
export const useBudget = () => useContext(BudgetContext);
