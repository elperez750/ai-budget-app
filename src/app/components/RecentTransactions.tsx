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
import { transactions } from "../data/TransactionData";
import Link from "next/link";

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
            <div
              className="flex mt-2 "
              key={transaction.id || transaction.description}
            >
              <Avatar className="mr-2">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col justify-center">
                <p>{transaction.description}</p>
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
          <Link href="/transactions" className="w-full">
            <Button className="w-full cursor-pointer">View All Transactions</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecentTransactions;
