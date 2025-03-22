import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card";
  import React from "react";
  import { Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react";
  
  interface BudgetCardProps {
    label: string;
    amount: number;
    footer: string;
    variant?: "default" | "income" | "expense";
  }
  
  const BudgetCard = ({ 
    label, 
    amount, 
    footer, 
    variant = "default" 
  }: BudgetCardProps) => {
    // Format amount as currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
    
    // Determine card styling based on variant
    const getCardStyle = () => {
      switch(variant) {
        case "income":
          return "border-l-4 border-l-green-500";
        case "expense":
          return "border-l-4 border-l-red-500";
        default:
          return "border-l-4 border-l-blue-500";
      }
    };
    
    // Determine amount text color based on variant
    const getAmountColor = () => {
      switch(variant) {
        case "income":
          return "text-green-600";
        case "expense":
          return "text-red-600";
        default:
          return "text-blue-600";
      }
    };
  
    // Determine icon based on variant
    const getIcon = () => {
      switch(variant) {
        case "income":
          return <TrendingUp className="h-5 w-5 text-green-500" />;
        case "expense":
          return <TrendingDown className="h-5 w-5 text-red-500" />;
        default:
          return <Wallet className="h-5 w-5 text-blue-500" />;
      }
    };
  
    return (
      <Card className={`mt-4 shadow-sm hover:shadow-md transition-all ${getCardStyle()}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-800">{label}</CardTitle>
            {getIcon()}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className={`text-2xl font-bold ${getAmountColor()}`}>{formattedAmount}</p>
        </CardContent>
        <CardFooter className="pt-2 border-t text-xs text-gray-500 flex items-center">
          <p>{footer}</p>
        </CardFooter>
      </Card>
    );
  };
  
  export default BudgetCard;