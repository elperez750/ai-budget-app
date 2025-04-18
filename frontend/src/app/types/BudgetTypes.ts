export interface BudgetType {
    budget_name: string;
    budget_amount: number;
    budget_period: string;
    budget_category: string;
  }
  
  // Define the context type
 export interface BudgetContextType {
    budgets: BudgetType[];
    isLoading: boolean;
    error: string | null;
    fetchBudgets: () => Promise<void>;
    createBudget: (budgetData: Omit<BudgetType, 'id'>) => Promise<void>;
    //updateBudget: (id: string, budgetData: Partial<BudgetType>) => Promise<void>;
    //deleteBudget: (id: string) => Promise<void>;
  }