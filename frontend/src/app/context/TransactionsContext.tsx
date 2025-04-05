"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { PlaidApi } from "../../utils/PlaidApi";
import { usePlaid } from "./PlaidContext";

type TransactionType = {
  transaction_id: string; // Unique identifier for the transaction (from Plaid)
  name: string;
  date: string; // Use ISO date string for consistency
  amount: number; // Use a number for the amount, can be negative for expenses
  category: string; // Category of the transaction (e.g., 'Food', 'Transport', etc.)
  logo_url: string; // Icon representing the transaction type (optional)
  currency: string; // Currency of the transaction (e.g., 'USD', 'EUR', etc.)
};

interface TransactionContextType {
  transactions: TransactionType[]; // Array of transactions
  fetchTransactions: () => void; // Function to update the transactions
  isTransactionLoading: boolean; // Optional: Loading state to indicate if transactions are being fetched
  setIsTransactionLoading: React.Dispatch<React.SetStateAction<boolean>>; // Function to set loading state
}

// Create the TransactionContext with default values
const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  fetchTransactions: () => {},
  isTransactionLoading: true,
  setIsTransactionLoading: () => {},
});

// Create hook to use the TransactionContext
export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransaction] = useState<TransactionType[]>([]);
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(true);
  const { accessToken } = usePlaid(); // Get access token from PlaidContext

  const fetchTransactions = async () => {
    if (!accessToken) {
      console.error("No access token available. Cannot fetch transactions.");
      setIsTransactionLoading(false); // Set loading to false if no access token
      return;
    } else {
      try {
        setIsTransactionLoading(true); // Set loading to true before fetching
        const response: any = await PlaidApi.syncTransactions(accessToken); // Fetch transactions from Plaid API
        setTransaction(response.added); // Update the state with the fetched transactions
      } catch (error) {
        console.error("Error fetching transactions:", error); // Log any errors
        setIsTransactionLoading(false); // Set loading to false in case of an error
        return;
      } finally {
        setIsTransactionLoading(false); // Ensure loading is set to false after the fetch attempt, regardless of success or failure
      }
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions, // Expose the fetch function to allow manual fetching of transactions
        isTransactionLoading,
        setIsTransactionLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
