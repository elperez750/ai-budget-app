"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { useTransactions } from "../../context/TransactionsContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

// Empty state component
const EmptyState = () => (
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
    <p className="text-slate-500 mb-3">No transactions available</p>
    <p className="text-sm text-slate-400">Connect your account to view your transaction history</p>
  </div>
);

const RecentTransactions = () => {
  const { transactions, isTransactionLoading } = useTransactions();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryIcon = (category: string) => {
    // Return different background colors based on transaction category
    const categories: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-700',
      'Shopping': 'bg-blue-100 text-blue-700',
      'Travel': 'bg-purple-100 text-purple-700',
      'Entertainment': 'bg-pink-100 text-pink-700',
      'Bills': 'bg-red-100 text-red-700',
      'Transport': 'bg-green-100 text-green-700',
    };
    
    return categories[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="h-full shadow-md overflow-hidden border-none bg-white">
      <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <CardDescription className="text-xs">Your latest financial activity</CardDescription>
          </div>
          <Link href="/transactions" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            View all
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isTransactionLoading ? (
          <LoadingSpinner />
        ) : recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => {
              const categoryClass = getCategoryIcon(transaction.category || 'Other');
              
              return (
                <div
                  className="p-4 hover:bg-gray-50 transition-colors"
                  key={transaction.transaction_id || `${transaction.date}-${transaction.name}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`rounded-full p-2 ${categoryClass}`}>
                        <Avatar className="h-8 w-8 border border-white">
                          <AvatarImage src={transaction.logo_url} />
                          <AvatarFallback className="bg-white text-xs">{transaction.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.name}</p>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                          {transaction.category && (
                            <>
                              <span className="mx-1 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{transaction.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          transaction.amount >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount >= 0 ? "+" : ""}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>

      <CardFooter className="bg-gray-50 border-t py-3 px-4">
        <Link href="/transactions" className="w-full">
          <Button variant="outline" className="w-full text-xs bg-white hover:bg-gray-100 border-gray-200">
            See All Transaction History
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentTransactions;