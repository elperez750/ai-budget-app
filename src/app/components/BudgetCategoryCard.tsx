import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetType } from "../data/BudgetData";
import { transactions, TransactionType } from "../data/TransactionData";
import { Progress } from "@/components/ui/progress";

interface BudgetCategoryCardProps {
  individualBudget: BudgetType;
}

const sumByAmounts = (
  transactions: TransactionType[],
  category: string
): number => {
  return transactions
    .filter((transaction) => transaction.category === category) // Filter by category
    .reduce((total, transaction) => total + transaction.amount, 0); // Sum amounts
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const BudgetCategoryCard = ({ individualBudget }: BudgetCategoryCardProps) => {
  const totalSpent = sumByAmounts(transactions, individualBudget.category);
  const moneyRemaining = individualBudget.budget - Math.abs(totalSpent);
  const percentageSpent = Math.round(
    (Math.abs(totalSpent) / individualBudget.budget) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{individualBudget.category}</CardTitle>

        <CardDescription>
          {formatCurrency(individualBudget.budget)} budgeted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <p>Spent: {formatCurrency(Math.abs(totalSpent))}</p>
          {moneyRemaining >= 0 ? (
            <p className="text-green-400 m-auto">
              {formatCurrency(moneyRemaining)}
            </p>
          ) : (
            <p className="text-red-400 m-auto">
              {formatCurrency(moneyRemaining)}
            </p>
          )}
        </div>

        <Progress value={percentageSpent} />
      </CardContent>
      <CardFooter>
        {moneyRemaining >= 0 ? (
          <p>{percentageSpent}% of the budget used</p>
        ) : (
          <p>{percentageSpent}% over the budget</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default BudgetCategoryCard;
