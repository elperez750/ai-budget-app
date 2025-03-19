"use client"

import React from "react";

import BudgetManagment from "../components/BudgetManagment";
import BudgetMain from "../components/BudgetMain";
import { BudgetsProvider } from "../context/BudgetsContext";

const Page = () => {

  return (
    <BudgetsProvider>
      <div className="flex flex-col p-4 md:p-6 lg:p-10">
        <BudgetManagment />
        <BudgetMain />
      </div>
    </BudgetsProvider>
  );
};

export default Page;
