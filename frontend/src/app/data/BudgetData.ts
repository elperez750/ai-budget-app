import { BudgetType } from "../types/BudgetTypes";

// Mock budget data that aligns with the BudgetType interface
export const mockBudgets: BudgetType[] = [
  {
    budgetId: 1,
    budgetName: "Monthly Rent",
    budgetAmount: 1200.00,
    budgetPeriod: "monthly",
    budgetCategory: "Housing"
  },
  {
    budgetId: 2,
    budgetName: "Groceries",
    budgetAmount: 500.00,
    budgetPeriod: "monthly",
    budgetCategory: "Food & Dining"
  },
  {
    budgetId: 3,
    budgetName: "Gas & Auto",
    budgetAmount: 300.00,
    budgetPeriod: "monthly",
    budgetCategory: "Transportation"
  },
  {
    budgetId: 4,
    budgetName: "Utilities",
    budgetAmount: 150.00,
    budgetPeriod: "monthly",
    budgetCategory: "Utilities"
  },
  {
    budgetId: 5,
    budgetName: "Entertainment",
    budgetAmount: 200.00,
    budgetPeriod: "monthly",
    budgetCategory: "Entertainment"
  },
  {
    budgetId: 6,
    budgetName: "Shopping",
    budgetAmount: 250.00,
    budgetPeriod: "monthly",
    budgetCategory: "Shopping"
  }
];