import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Activity, AlertTriangle, CheckCircle, TrendingUp, BadgeDollarSign, Wallet } from "lucide-react";
import React from "react";
import { Progress } from "../../components/ui/progress";

interface BudgetHealthProps {
  healthPercentage?: number;
}

const BudgetHealth: React.FC<BudgetHealthProps> = ({
  healthPercentage = 74, // Default value if not provided
}) => {
  const getHealthColor = (value: number): string => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getProgressColor = (value: number): string => {
    if (value < 30) return "text-red-500";
    if (value < 70) return "text-amber-500";
    return "text-emerald-500";
  };

  const getHealthStatus = (value: number): string => {
    if (value < 30) return "At Risk";
    if (value < 70) return "Caution";
    return "Healthy";
  };

  const getHealthIcon = (value: number) => {
    if (value < 30) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (value < 70) return <Activity className="h-5 w-5 text-amber-500" />;
    return <CheckCircle className="h-5 w-5 text-emerald-500" />;
  };

  return (
    <Card className="shadow-md overflow-hidden border-none bg-white">
      <CardHeader className="bg-gradient-to-br from-indigo-50 to-indigo-100 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Financial Health</CardTitle>
            <CardDescription className="text-xs">Your budget wellness score</CardDescription>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm">
            {getHealthIcon(healthPercentage)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              healthPercentage < 30 ? "bg-red-100 text-red-700" : 
              healthPercentage < 70 ? "bg-amber-100 text-amber-700" : 
              "bg-emerald-100 text-emerald-700"
            }`}>
              {getHealthStatus(healthPercentage)}
            </span>
          </div>
          <span className={`text-sm font-bold ${getProgressColor(healthPercentage)}`}>
            {healthPercentage}%
          </span>
        </div>

        <Progress value={healthPercentage} className="h-2" 
          indicatorClassName={`${
            healthPercentage < 30 ? "bg-red-500" : 
            healthPercentage < 70 ? "bg-amber-500" : 
            "bg-emerald-500"
          }`}
        />

        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <BadgeDollarSign className="h-4 w-4 text-indigo-500 mr-2" />
                <span className="text-sm font-medium">Budget Utilization</span>
              </div>
              <span className="text-sm font-medium">68%</span>
            </div>
            <Progress value={68} className="h-1.5" indicatorClassName="bg-indigo-500" />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium">Savings Progress</span>
              </div>
              <span className="text-sm font-medium">82%</span>
            </div>
            <Progress value={82} className="h-1.5" indicatorClassName="bg-purple-500" />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-teal-500 mr-2" />
                <span className="text-sm font-medium">Financial Goals</span>
              </div>
              <span className="text-sm font-medium">45%</span>
            </div>
            <Progress value={45} className="h-1.5" indicatorClassName="bg-teal-500" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t text-xs text-center text-gray-500 bg-gray-50">
        <div className="w-full">
          Based on your spending habits and budget planning
        </div>
      </CardFooter>
    </Card>
  );
};

export default BudgetHealth;
