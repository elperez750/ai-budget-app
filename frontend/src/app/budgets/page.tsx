"use client";

import React from "react";

import BudgetManagment from "../components/budget/BudgetManagment";
import BudgetMain from "../components/budget/BudgetMain";
import { BudgetProvider } from "../context/BudgetContext";
import ProtectedRoute from "../components/misc/ProtectedRoute";
import { useBudget } from "../context/BudgetContext";
import NoBudgetsYet from "../components/budget/NoBudgets";


const Page = () => {

  

  const { budgets } = useBudget()


  return (
    <ProtectedRoute>
        <div className="flex flex-col p-4 md:p-6 lg:p-10">
          {budgets.length > 0 ? (
            <>
               <BudgetManagment />
               <BudgetMain />
            </>
           ) : (<NoBudgetsYet />)
        }
        </div>
    </ProtectedRoute>
  );
};

export default Page;
