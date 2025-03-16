import React, { useState, useEffect } from "react";
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
import { useFilters } from "../context/FilterContext";
import { filterTransactions } from "../data/TransactionData";

const TransactionsHistory = () => {
  const { filters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const filteredTransactions = filterTransactions(transactions, filters);
  const itemsPerPage = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filteredTransactions.length === 0) {
      setCurrentPage(0);
    } else if (currentPage === 0) {
      setCurrentPage(1);
    }
  }, [filteredTransactions.length, currentPage]);

  // Calculate pagination values
  const startIndex = (currentPage === 0 || filteredTransactions.length === 0) 
    ? 0 
    : (currentPage - 1) * itemsPerPage;
  
  const endIndex = (currentPage === 0 || filteredTransactions.length === 0)
    ? 0
    : startIndex + itemsPerPage;

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1){
      setCurrentPage(currentPage - 1);
      
    } 
  };

  return (
    <div className="mt-5 mx-auto max-w-5xl">
      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transaction History
          </CardTitle>
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
                {filteredTransactions.length > 0 ? (
                  filteredTransactions
                    .slice(startIndex, endIndex)
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b hover:bg-gray-100 transition"
                      >
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
                    ))
                ) : (
                  <tr>
                    <td className="p-4 text-center text-gray-500">
                      No transactions match your current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center px-6 py-4">
          <p className="text-gray-500 text-sm">
            {filteredTransactions.length > 0 ? (
              `Showing ${startIndex + 1} - ${Math.min(endIndex, filteredTransactions.length)} of ${filteredTransactions.length} transactions`
            ) : (
              "No transactions to display"
            )}
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || filteredTransactions.length === 0}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer"
              variant="outline"
            >
              ← Previous
            </Button>
            <span className="text-gray-700 text-sm font-medium">
              Page {currentPage > 0 ? currentPage : 0} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || filteredTransactions.length === 0}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer"
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