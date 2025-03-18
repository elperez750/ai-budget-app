import React from "react";

import BudgetManagment from "../components/BudgetManagment";
import BudgetMain from "../components/BudgetMain";
import { BudgetProvider } from "../context/BudgetsContext";

const Page = () => {
  // Calculate health percentage based on remaining vs total budget

  return (
    <BudgetProvider>
      <div className="flex flex-col p-4 md:p-6 lg:p-10">
        <BudgetManagment />
        <BudgetMain />
      </div>
    </BudgetProvider>
  );
};

export default Page;
