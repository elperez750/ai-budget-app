export interface BudgetType {
    budgetId: number
    budgetName: string;
    budgetAmount: number;
    budgetPeriod: string;
    budgetCategory: string;
  }

  

  // Define the context type
 export interface BudgetContextType {
    budgets: BudgetType[];
    isLoading: boolean;
    error: string | null;
    fetchBudgets: () => Promise<void>;
    createBudget: (budgetData: Omit<BudgetType, 'budgetId'>) => Promise<void>;
    updateBudget: (id: number, budget: Partial<BudgetType>) => Promise<void>;
    deleteBudget: (id: number) => Promise<void>;
  }