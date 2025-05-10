"use client"

import React from "react";
import BudgetCard from "./BudgetCard";
import BudgetHealth from "./BudgetHealth";
import { useBudget } from "../../context/BudgetContext";
import { transactions } from "../../data/TransactionData";
import { TransactionType } from "../../types/TransactionTypes";
import { useTransactions } from "../../context/TransactionsContext";
import { mapCategories } from "./BudgetCategoryCard";
import { mapToCategory } from "./BudgetCategoryCard";
const BudgetManagment = () => {

  const { budgets } = useBudget()
  const { transactions } = useTransactions()


  const addedBudgets = budgets.reduce(
    (accumulator, currentValue) => accumulator + currentValue.budgetAmount,
    0 
  );

  //This function will get all the categories in transactions that are also in the categories of the budgets, and then add them up
const sumByAmounts = (
  transactions: TransactionType[],
  categories: string[]
): number => {
  return transactions
    .filter((transaction) => categories.includes(mapToCategory(transaction.category))) // Filter by category
    .reduce((total, transaction) => total + transaction.amount, 0); // Sum amounts
};


const allBudgetCategories = budgets.map(budget => budget.budgetCategory)  
console.log("all budget categories")
console.log(allBudgetCategories)
const totalOfBudgetSpent = Math.abs(sumByAmounts(transactions, allBudgetCategories))

const remainingInBudget = addedBudgets - totalOfBudgetSpent
  const cardInfo = [
    {
      id: 0,
      label: "Total Budgeted",
      amount: addedBudgets,
      footer: "For March 2025",
      variant: "default",
    },
    {
      id: 1,
      label: "Total Spent",
      amount: totalOfBudgetSpent,
      footer: "87% of total",
      variant: "expense",
    },
    {
      id: 2,
      label: "Remaining",
      amount: remainingInBudget,
      footer: "Under Budget",
      variant: "income",
    },
  ];


  
const healthPercentage = Math.round(
  (cardInfo[2].amount / cardInfo[0].amount) * 100
);




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
