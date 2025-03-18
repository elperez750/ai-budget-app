// BudgetContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { budgets as initialBudgets } from "../data/BudgetData";
import { BudgetType } from '../data/BudgetData';


// Define the context type
interface BudgetContextType {
  budgets: BudgetType[];
  addBudget: (budget: BudgetType) => void;
}

// Create the context with initial undefined value
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Props type for provider
interface BudgetProviderProps {
  children: ReactNode;
}

// Create a provider component
export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [budgets, setBudgets] = useState<BudgetType[]>(initialBudgets);

  // Function to add a new budget
  const addBudget = (newBudget: BudgetType) => {
    setBudgets([...budgets, newBudget]);
  };

  // Provide the context values to all children
  return (
    <BudgetContext.Provider value={{ budgets, addBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

// Custom hook to use the budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};