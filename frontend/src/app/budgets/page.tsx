"use client";

import React from "react";

import BudgetManagment from "../components/BudgetManagment";
import BudgetMain from "../components/BudgetMain";
import { BudgetsProvider } from "../context/BudgetsContext";
import ProtectedRoute from "../components/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <BudgetsProvider>
        <div className="flex flex-col p-4 md:p-6 lg:p-10">
          <BudgetManagment />
          <BudgetMain />
        </div>
      </BudgetsProvider>
    </ProtectedRoute>
  );
};

export default Page;
