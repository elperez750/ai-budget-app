import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transactions } from "../data/TransactionData";

const TransactionsHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="mt-5 mx-auto max-w-5xl">
      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            View all your past transactions
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-left font-medium">Amount</th>
                  <th className="p-3 text-right font-medium">Category</th>
                  <th className="p-3 text-right font-medium">Account</th>
                  <th className="p-3 text-right font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(startIndex, endIndex).map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">{transaction.date}</td>
                    <td className="p-3">{transaction.description}</td>
                    {transaction.type === "income" ? (
                      <td className="p-3 text-green-600 font-semibold">
                        +${transaction.amount.toFixed(2)}
                      </td>
                    ) : (
                      <td className="p-3 text-red-600 font-semibold">
                        -${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    )}
                    <td className="p-3 text-right">{transaction.category}</td>
                    <td className="p-3 text-right">{transaction.account}</td>
                    <td className="p-3 text-right capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center px-6 py-4">
          <p className="text-gray-500 text-sm">Showing {startIndex + 1} - {Math.min(endIndex, transactions.length)} of {transactions.length} transactions</p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-sm"
              variant="outline"
            >
              ← Previous
            </Button>
            <span className="text-gray-700 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-sm"
              variant="outline"
            >
              Next →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionsHistory;
