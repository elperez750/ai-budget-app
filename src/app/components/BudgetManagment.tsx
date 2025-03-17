import React from "react";
const cardInfo = [
  {
    id: 0,
    label: "Total Budgeted",
    amount: 4000.0,
    footer: "For March 2025",
    variant: "default",
  },
  {
    id: 1,
    label: "Total Spent",
    amount: 2360.0,
    footer: "87% of total",
    variant: "expense",
  },
  {
    id: 2,
    label: "Remaining",
    amount: 3989.0,
    footer: "Under Budget",
    variant: "income",
  },
];

const healthPercentage = Math.round(
  (cardInfo[2].amount / cardInfo[0].amount) * 100
);

import BudgetCard from "./BudgetCard";
import BudgetHealth from "./BudgetHealth";

const BudgetManagment = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Budget Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardInfo.map((info) => (
          <BudgetCard
            key={info.id}
            label={info.label}
            amount={info.amount}
            footer={info.footer}
            variant={info.variant as "default" | "income" | "expense"}
          />
        ))}

        <BudgetHealth healthPercentage={healthPercentage} />
      </div>
    </div>
  );
};

export default BudgetManagment;
