import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {  PieChart, TrendingUp, DollarSign } from "lucide-react";
import NewBudgetForm from "./NewBudgetForm";


interface BudgetData {
    name: string;
    amount: number;
    period: string;
    category: string;
}

const NoBudgetsYet = () => {
  const handleCreateBudget = ({name, amount, period, category}: BudgetData) => {
    console.log(name, amount, period, category);
  };


  return (
    <div className="flex flex-col items-center justify-center p-6 h-full">
      <Card className="w-full max-w-3xl shadow-lg border-2 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            No Budgets Yet
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create your first budget to start tracking your financial goals
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Illustration */}
          <div className="flex justify-center py-6">
            <div className="relative">
              <div className="bg-blue-50 w-40 h-40 rounded-full flex items-center justify-center">
                <PieChart
                  size={80}
                  className="text-blue-500"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-100 rounded-full p-2">
                <DollarSign size={24} className="text-green-500" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-purple-100 rounded-full p-2">
                <TrendingUp size={24} className="text-purple-500" />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Track Expenses
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor where your money goes and identify spending patterns
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Set Limits</h3>
              <p className="text-gray-600 text-sm">
                Establish spending boundaries for different categories
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Achieve Goals
              </h3>
              <p className="text-gray-600 text-sm">
                Work toward financial milestones with structured planning
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Reduce Stress
              </h3>
              <p className="text-gray-600 text-sm">
                Gain peace of mind knowing your finances are organized
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
         
          <NewBudgetForm  />
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoBudgetsYet;
