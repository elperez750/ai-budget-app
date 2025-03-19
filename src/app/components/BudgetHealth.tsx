import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import React from "react";

interface BudgetHealthProps {
  healthPercentage?: number;
}

const BudgetHealth: React.FC<BudgetHealthProps> = ({
  healthPercentage = 74, // Default value if not provided
}) => {
  const getHealthColor = (value: number): string => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getHealthStatus = (value: number): string => {
    if (value < 30) return "At Risk";
    if (value < 70) return "Caution";
    return "Healthy";
  };

  const getHealthIcon = (value: number) => {
    if (value < 30) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (value < 70) return <Activity className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <Card className="mt-4 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Budget Health</CardTitle>
          {getHealthIcon(healthPercentage)}
        </div>
        <CardDescription>Overall financial status</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-1 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {getHealthStatus(healthPercentage)}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {healthPercentage}%
          </span>
        </div>

        <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-full left-0 transition-all ${getHealthColor(
              healthPercentage
            )}`}
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Spending vs Budget</span>
            <span className="text-sm font-medium">68%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Savings Goal</span>
            <span className="text-sm font-medium">82%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t text-sm text-gray-500">
      </CardFooter>
    </Card>
  );
};

export default BudgetHealth;
