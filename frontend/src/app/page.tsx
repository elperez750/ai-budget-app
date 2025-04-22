"use client"
import React from "react";
import RecentTransactions from "./components/RecentTransactions";
import AuthReqired from "./components/LoggedOutHome";
import { useAuth } from "./context/AuthContext";
import { useBudget } from "./context/BudgetContext";
import PlaidLink from "./components/PlaidLink";
import LoadingComponent from "./components/LoadingComponent";
import BudgetHealth from "./components/BudgetHealth";
import BudgetCategoryCard from "./components/BudgetCategoryCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { budgets, fetchBudgets } = useBudget();
  
  // Fetch budgets when the component mounts
  React.useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);
  
  // Sample data for spending overview chart
  const spendingData = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 900 },
    { name: 'Mar', amount: 1500 },
    { name: 'Apr', amount: 1000 },
    { name: 'May', amount: 800 },
    { name: 'Jun', amount: 1300 },
  ];

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingComponent />;
  }
  
  // Show different content based on authentication status
  return (
    <div>
      {user ? (
        // Authenticated user content
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium text-blue-700">Total Balance</CardTitle>
                      <div className="p-2 bg-blue-500 rounded-full">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$4,550.25</div>
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+15.3% from last month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium text-purple-700">Monthly Spending</CardTitle>
                      <div className="p-2 bg-purple-500 rounded-full">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,245.80</div>
                    <div className="flex items-center mt-1 text-xs text-red-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+8.2% from last month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-none shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium text-emerald-700">Savings</CardTitle>
                      <div className="p-2 bg-emerald-500 rounded-full">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,150.42</div>
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+12.6% from goal</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Spending Chart */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Spending Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Budget Categories Summary */}
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">Budget Categories</CardTitle>
                    <CardDescription>Your active budget allocations</CardDescription>
                  </div>
                  <Link href="/budgets" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                    Manage Budgets
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.length > 0 ? (
                      budgets.slice(0, 3).map((budget) => (
                        <BudgetCategoryCard key={budget.budgetId} individualBudget={budget} />
                      ))
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-slate-100 p-3 mb-3">
                          <svg
                            className="h-6 w-6 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-500 mb-3">No budgets created yet</p>
                        <p className="text-sm text-slate-400 mb-4">Create your first budget to start tracking expenses</p>
                        <Link href="/budgets">
                          <Button variant="outline" size="sm">Create Budget</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
                {budgets.length > 3 && (
                  <CardFooter className="pt-0 pb-4">
                    <Link href="/budgets" className="w-full">
                      <Button variant="outline" className="w-full">View All Budgets</Button>
                    </Link>
                  </CardFooter>
                )}
              </Card>
            </div>
            
            <div className="w-full md:w-1/3 space-y-6">
              {/* Connect Account Button */}
              <div className="mb-4">
                <PlaidLink />
              </div>
              
              {/* Budget Health */}
              <BudgetHealth healthPercentage={78} />
              
              {/* Recent Transactions */}
              <RecentTransactions />
            </div>
          </div>
        </div>
      ) : (
        // Not authenticated user content
        <AuthReqired />
      )}
    </div>
  );
}