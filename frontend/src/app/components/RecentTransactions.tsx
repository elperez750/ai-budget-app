"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useTransactions } from "../context/TransactionsContext";
import Link from "next/link";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const RecentTransactions = () => {
  const { transactions, isTransactionLoading } = useTransactions();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="p-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </CardHeader>

        <CardContent>
          {isTransactionLoading ? (
            <LoadingSpinner />
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                className="flex items-center justify-between py-2 border-b"
                key={transaction.transaction_id || `${transaction.date}-${transaction.name}`}
              >
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage src={transaction.logo_url} />
                    <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <div>
                  <p
                    className={
                      transaction.amount >= 0
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {transaction.amount >= 0 ? "+" : ""}
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No transactions available.</p>
          )}
        </CardContent>

        <CardFooter>
          <Link href="/transactions" className="w-full">
            <Button className="w-full">View All Transactions</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentTransactions;