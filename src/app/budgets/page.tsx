import React from "react";

import BudgetManagment from "../components/BudgetManagment";


const Page = () => {
  // Calculate health percentage based on remaining vs total budget
  
  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-10">
        <BudgetManagment />
    </div>
  );
};

export default Page;