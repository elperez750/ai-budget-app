"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { BudgetType } from "../data/BudgetData";
import { budgets as initialBudgets }  from "../data/BudgetData";
interface BudgetsContextType {
  budgets: BudgetType[];
  addBudget: (budget: BudgetType) => void;
  // Add other methods as needed (e.g., updateBudget, deleteBudget)
}

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export const BudgetsProvider = ({ children }: { children: React.ReactNode }) => {
  // Load budgets from localStorage on initial render
  const [budgets, setBudgets] = useState<BudgetType[]>(initialBudgets);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("budgets", JSON.stringify(budgets));
    }
  }, [budgets]);

  const addBudget = (budget: BudgetType) => {
    setBudgets((prevBudgets) => [...prevBudgets, budget]);
  };

  // Add other methods as needed (e.g., updateBudget, deleteBudget)

  return (
    <BudgetsContext.Provider value={{ budgets, addBudget }}>
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetsContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetsProvider");
  }
  return context;
};