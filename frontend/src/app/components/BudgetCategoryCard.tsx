import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { BudgetType } from "../types/BudgetTypes";
import { TransactionType } from "../types/TransactionTypes";
import { Progress } from "../../components/ui/progress";
import { ArrowDownCircle, ArrowUpCircle, Trash } from "lucide-react";
import { useTransactions } from "../context/TransactionsContext";

interface BudgetCategoryCardProps {
  individualBudget: BudgetType;
}

/**
 * Calculates the total amount spent in a specific budget category
 * @param transactions - Array of transaction records
 * @param category - Budget category to filter by
 * @returns Total amount spent in the category
 */
const sumByAmounts = (
  transactions: TransactionType[],
  category: string
): number => {
  if (!transactions || !Array.isArray(transactions)) return 0;
  
  return transactions
    .filter((transaction) => transaction.category === category)
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
};

/**
 * Formats a number as USD currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
const formatCurrency = (amount: number): string => {
  // Guard against NaN values
  if (isNaN(amount)) return "$0.00";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Budget Category Card Component
 * Displays budget information for a specific category including
 * allocated budget, spending progress, and remaining funds
 */
const BudgetCategoryCard = ({ individualBudget }: BudgetCategoryCardProps) => {
  const { transactions } = useTransactions();
  
  // Ensure budget_amount is a number
  const budgetAmount = Number(individualBudget.budget_amount) || 0;
  
  // Calculate spending metrics
  const totalSpent = Math.abs(sumByAmounts(transactions, individualBudget.budget_category));
  const moneyRemaining = budgetAmount - totalSpent;
  
  // Guard against division by zero
  const percentageSpent = budgetAmount > 0 
    ? Math.round((totalSpent / budgetAmount) * 100) 
    : 0;
  
  // Determine status based on spending
  const isOverBudget = moneyRemaining < 0;
  const statusColor = isOverBudget 
    ? "text-red-500" 
    : percentageSpent > 80 
      ? "text-amber-500" 
      : "text-emerald-500";
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0">
          <CardTitle className="text-lg font-semibold">{individualBudget.budget_name}</CardTitle>
          <CardDescription className="flex justify-around text-sm font-medium mt-1 sm:mt-0 items-center gap-1 ">
            Budget: {formatCurrency(budgetAmount)}
            <Trash className="h-4 w-4 text-red-500" />
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Spent:</span>
            <span className="font-medium">{formatCurrency(totalSpent)}</span>
          </div>
          
          <div className="flex items-center gap-1 mt-1 sm:mt-0">
            {isOverBudget ? (
              <ArrowUpCircle className="h-4 w-4 text-red-500" />
            ) : (
              <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
            )}
            <span className={`font-medium ${statusColor}`}>
              {isOverBudget 
                ? `-${formatCurrency(Math.abs(moneyRemaining))}` 
                : formatCurrency(moneyRemaining)}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <Progress 
            value={Math.min(percentageSpent, 100)} 
            className={`h-2 ${isOverBudget ? "bg-red-100" : "bg-gray-100"}`} 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="hidden xs:inline">25%</span>
            <span>50%</span>
            <span className="hidden xs:inline">75%</span>
            <span>100%</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 sm:pb-4">
        <p className={`text-sm font-medium ${statusColor}`}>
          {isOverBudget 
            ? `${percentageSpent}% over budget` 
            : `${percentageSpent}% of budget used`}
        </p>
      </CardFooter>
    </Card>
  );
};

export default BudgetCategoryCard;