import React, { useState, useEffect } from "react";
import RecentTransactions from "./RecentTransactions";
import BudgetHealth from "../budget/BudgetHealth";
import BudgetCategoryCard from "../budget/BudgetCategoryCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useBudget } from "../../context/BudgetContext";
import { useBankAccounts } from "../../context/BankAccountContext";
import { useTransactions } from "../../context/TransactionsContext";
import { TransactionType } from "../../types/TransactionTypes";
import { mockTransactions } from "../../data/TransactionData";

// Function to update transaction dates to current year/month for demo purposes
const updateTransactionDates = (transactions: TransactionType[]): TransactionType[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  return transactions.map(transaction => {
    const transDate = new Date(transaction.date);
    // Update transaction date to current year and random day in current month
    if (transDate.getMonth() !== currentMonth || transDate.getFullYear() !== currentYear) {
      const day = Math.floor(Math.random() * 28) + 1; // Random day between 1-28
      const newDate = new Date(currentYear, currentMonth, day);
      return {
        ...transaction,
        date: newDate.toISOString().split('T')[0]
      };
    }
    return transaction;
  });
};

// Function to generate monthly spending data from transactions
const generateMonthlySpendingData = (transactions: TransactionType[]) => {
  // Create a map to hold the spending by month
  const monthlySpending = new Map<string, number>();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize the map with 0 for the last 6 months
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    const monthName = months[d.getMonth()];
    monthlySpending.set(monthName, 0);
  }

  // Aggregate transaction amounts by month
  transactions.forEach(transaction => {
    if (transaction.amount > 0) return; // Skip income transactions

    const date = new Date(transaction.date);
    const monthName = months[date.getMonth()];
    
    // Only process transactions from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    if (date >= sixMonthsAgo && monthlySpending.has(monthName)) {
      monthlySpending.set(
        monthName,
        (monthlySpending.get(monthName) || 0) + Math.abs(transaction.amount)
      );
    }
  });
  
  // Ensure we have data for the current month (for demo purposes)
  const currentMonth = months[today.getMonth()];
  if (monthlySpending.get(currentMonth) === 0) {
    // Add some realistic demo spending for the current month if none exists
    monthlySpending.set(currentMonth, 1200 + Math.random() * 500);
  }

  // Convert the map to an array for the chart
  return Array.from(monthlySpending.entries())
    .map(([name, amount]) => ({ name, amount: parseFloat(amount.toFixed(2)) }))
    .sort((a, b) => {
      const monthA = months.indexOf(a.name);
      const monthB = months.indexOf(b.name);
      return monthA - monthB;
    });
};

const HasSynced = () => {
  const { budgets } = useBudget();
  const { bankAccounts } = useBankAccounts();
  const { transactions, fetchTransactions } = useTransactions();
  const [spendingData, setSpendingData] = useState<{name: string, amount: number}[]>([]);
  const [monthlySpending, setMonthlySpending] = useState<number>(0);
  
  // Force fetch transactions when component mounts to ensure up-to-date data
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Generate spending data from transactions
  useEffect(() => {
    // Use real transactions if available, otherwise use mock data
    let dataSource = transactions.length > 0 ? transactions : mockTransactions;

    // Update transaction dates to current month for demo purposes
    if (dataSource === mockTransactions) {
      dataSource = updateTransactionDates(dataSource);
    }

    // Generate the chart data
    const chartData = generateMonthlySpendingData(dataSource);
    setSpendingData(chartData);

    // Calculate this month's spending
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const thisMonthData = chartData.find(item => item.name === currentMonth);
    setMonthlySpending(thisMonthData?.amount || 0);

    // Log for debugging
    console.log("Using transactions for chart:", dataSource.length > 0 ? "Plaid/Real data" : "Mock data");

  }, [transactions]);
  
  // Set up periodic refresh for transactions every 30 minutes
  useEffect(() => {
    // Set up the interval for transaction updates
    const intervalId = setInterval(() => {
      fetchTransactions();
    }, 30 * 60 * 1000); // Every 30 minutes

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-blue-700">
                      Total Balance
                      
                    </CardTitle>
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
                    <CardTitle className="text-sm font-medium text-purple-700">
                      Monthly Spending
                    </CardTitle>
                    <div className="p-2 bg-purple-500 rounded-full">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlySpending.toFixed(2)}</div>
                  <div className="flex items-center mt-1 text-xs text-red-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>Updated every 30 minutes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-none shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-emerald-700">
                      Savings
                    </CardTitle>
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
                    <BarChart
                      data={spendingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar
                        dataKey="amount"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                        name="Monthly Spending"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                  Data updates every 30 minutes
                </div>
              </CardContent>
            </Card>

            {/* Budget Categories Summary */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Budget Categories
                  </CardTitle>
                  <CardDescription>
                    Your active budget allocations
                  </CardDescription>
                </div>
                <Link
                  href="/budgets"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  Manage Budgets
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.length > 0 ? (
                    budgets
                      .slice(0, 3)
                      .map((budget) => (
                        <BudgetCategoryCard
                          key={budget.budgetId}
                          individualBudget={budget}
                        />
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
                      <p className="text-slate-500 mb-3">
                        No budgets created yet
                      </p>
                      <p className="text-sm text-slate-400 mb-4">
                        Create your first budget to start tracking expenses
                      </p>
                      <Link href="/budgets">
                        <Button variant="outline" size="sm">
                          Create Budget
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
              {budgets.length > 3 && (
                <CardFooter className="pt-0 pb-4">
                  <Link href="/budgets" className="w-full">
                    <Button variant="outline" className="w-full">
                      View All Budgets
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>

          <div className="w-full md:w-1/3 space-y-6">
            {/* Bank Accounts */}
            <Card className="shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
              <CardHeader className="border-b border-blue-100 pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-blue-800">Your Accounts</CardTitle>
                    <CardDescription className="text-blue-600">Financial snapshot</CardDescription>
                  </div>
                  <div className="p-2 bg-blue-500 rounded-full">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {bankAccounts.length > 0 ? (
                  <>
                    <div className="mb-5 p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm font-medium text-blue-700 mb-1">Total Available Balance</div>
                      <div className="text-3xl font-bold text-blue-800">
                        ${bankAccounts.reduce((sum, account) => sum + account.availableBalance, 0).toFixed(2)}
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-xs">
                        <div className="flex items-center text-emerald-600">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+2.3% this month</span>
                        </div>
                        <div className="text-blue-500">
                          {bankAccounts.length} {bankAccounts.length === 1 ? 'account' : 'accounts'}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div 
                        key={account.accountId} 
                        className="p-4 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md border border-blue-100 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 h-full w-1.5 bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-blue-900 text-lg">
                            {account.accountName}
                          </div>
                          <div className="text-xs font-mono px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {account.currency}
                          </div>
                        </div>
                        
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-bold text-blue-900">
                            ${account.availableBalance.toFixed(2)}
                          </span>
                          <span className="text-xs text-blue-600">available</span>
                        </div>
                        
                        {account.currentBalance !== account.availableBalance && (
                          <div className="text-sm text-blue-600 mt-1">
                            ${account.currentBalance.toFixed(2)} <span className="text-xs">current balance</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-3 pt-2 border-t border-blue-100">
                          <div className="text-xs text-blue-500">
                            Account ending in {account.accountId.slice(-4)}
                          </div>
                          <button className="text-xs text-blue-700 hover:text-blue-900 flex items-center">
                            Details <ArrowRight className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-blue-800 font-medium">No accounts found</p>
                    <p className="text-sm text-blue-600 mt-1 max-w-xs mx-auto">
                      Please check your Plaid connection or connect additional accounts
                    </p>
                  </div>
                )}
              </CardContent>
              {bankAccounts.length > 0 && (
                <CardFooter className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 border-t border-blue-100">
                  <div className="w-full flex items-center justify-between py-2">
                    <div className="text-sm text-blue-700">
                      <span className="font-bold">{bankAccounts.length}</span> connected {bankAccounts.length === 1 ? 'account' : 'accounts'}
                    </div>
                    <button className="text-blue-700 hover:text-blue-900 text-sm font-medium flex items-center">
                      Manage accounts <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </CardFooter>
              )}
            </Card>
            
            {/* Budget Health */}
            <BudgetHealth healthPercentage={78} />

            {/* Recent Transactions */}
            <RecentTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasSynced;