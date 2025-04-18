"use client";

import React from "react";

import BudgetManagment from "../components/BudgetManagment";
import BudgetMain from "../components/BudgetMain";
import { BudgetProvider } from "../context/BudgetContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useBudget } from "../context/BudgetContext";
import NoBudgetsYet from "../components/NoBudgets";


const Page = () => {

  

  const { budgets } = useBudget()


  return (
    <ProtectedRoute>
      <BudgetProvider>
        <div className="flex flex-col p-4 md:p-6 lg:p-10">
          {budgets ? (
            <>
               <BudgetManagment />
               <BudgetMain />
            
            </>
          
        
       
           ) : (<NoBudgetsYet />)

        }
        </div>
      </BudgetProvider>
    </ProtectedRoute>
  );
};

export default Page;
