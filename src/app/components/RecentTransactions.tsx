import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const transactions = [
  {
    id:0,
    title: "Grocery Store",
    date: "March 28, 2025",
    amount: -85.32,
    type: "expense",
    category: "groceries",
  },
  {
    id:1,
    title: "Rent Payment",
    date: "March 25, 2025",
    amount: -1200.0,
    type: "expense",
    category: "housing",
  },
  {
    id:2,
    title: "Salary Deposit",
    date: "March 15, 2025",
    amount: 2350.0,
    type: "income",
    category: "salary",
  },
  {
    id:3,
    title: "Restaurant",
    date: "March 12, 2025",
    amount: -64.5,
    type: "expense",
    category: "dining",
  },
  {
    id:4,
    title: "Online Shopping",
    date: "March 10, 2025",
    amount: -129.99,
    type: "expense",
    category: "shopping",
  },
];

const RecentTransactions = () => {
  return (
    <div className="p-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">Recent Transcations</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.map((transaction) => (
            <div className="flex mt-2 " key={transaction.id || transaction.title}>
              <Avatar className="mr-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col justify-center">
                <p>{transaction.title}</p>
                <p>{transaction.date}</p>
              </div>

              <div className="ml-auto">
                {transaction.amount > 0 ? (
                  <p className="text-green-400">
                    +{transaction.amount.toFixed(2)}
                  </p>
                ) : (
                  <p className="text-red-500">
                    {transaction.amount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter>
          <Button className="w-full">View All Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentTransactions;
