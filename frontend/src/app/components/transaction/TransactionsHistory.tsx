"use client"

import React, { useState, useEffect } from "react";
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
import { useFilters } from "../../context/FilterContext";
import { filterTransactions } from "../../data/TransactionData";
import { useTransactions } from "../../context/TransactionsContext";
import { usePlaid } from "../../context/PlaidContext";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const TransactionsHistory = () => {
  const { filters } = useFilters();
  const { transactions, isTransactionLoading, fetchTransactions } = useTransactions();
  const [currentPage, setCurrentPage] = useState(1);
  const filteredTransactions = filterTransactions(transactions, filters);
  const itemsPerPage = 10;


    useEffect(() => {

        fetchTransactions(); // Ensures fetch is always triggered on page load
     
    }, []);


  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [filters]);

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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };


  return (
    <div className="mt-5 mx-auto max-w-6xl">
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
          {isTransactionLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Merchant</th>
                    <th className="p-3 text-left font-medium">Category</th>
                    <th className="p-3 text-right font-medium">Amount</th>
                    <th className="p-3 text-center font-medium">Logo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions
                      .slice(startIndex, endIndex)
                      .map((transaction) => (
                        <tr
                          key={transaction.transaction_id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-3 align-middle">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="p-3 align-middle font-medium">
                            {transaction.name}
                          </td>
                          <td className="p-3 align-middle">
                           
                          </td>
                          <td className={`p-3 text-right align-middle font-semibold ${
                            transaction.amount >= 0 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {transaction.amount >= 0 ? "+" : ""}
                            {transaction.amount.toFixed(2)} {transaction.currency}
                          </td>
                          <td className="p-3 text-center align-middle">
                            <Avatar className="inline-block h-8 w-8">
                              <AvatarImage src={transaction.logo_url} alt={transaction.name} />
                              <AvatarFallback>
                                {transaction.name?.[0]?.toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
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