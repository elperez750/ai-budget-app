"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { PlaidApi } from "../../utils/PlaidApi";
import { usePlaid } from "./PlaidContext";
import { useAuth } from "./AuthContext";
import { TransactionType, TransactionContextType } from "../types/TransactionTypes";

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  setTransaction: () => {},
  fetchTransactions: async () => {},
  isTransactionLoading: false,
  setIsTransactionLoading: () => {},
  accounts: [],
});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransaction] = useState<TransactionType[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const { hasAccessToken } = usePlaid();
  const { user } = useAuth();

  // Function to fetch transactions
  const fetchTransactions = async () => {
    // Get access token
    const token = await hasAccessToken();
    if (!token) return;

    // Check if we've fetched recently (within last 15 minutes) to avoid excessive API calls
    const now = new Date();
    if (lastFetchTime && now.getTime() - lastFetchTime.getTime() < 15 * 60 * 1000) {
      console.log("Skipping transaction fetch - last fetch was recent");
      return; // Skip fetch if we just did it recently
    }

    setIsTransactionLoading(true);

    try {
      // Try database first
      const dbResults: any = await PlaidApi.fetchTransactionsFromDB(token);

      // If database has transactions, use them
      if (dbResults && dbResults.transactions.length > 0) {
        setTransaction(dbResults.transactions);
        setAccounts(dbResults.accounts || []);
        console.log(`Loaded ${dbResults.transactions.length} transactions from database`);
      }
      // Otherwise sync with Plaid
      else {
        console.log("No transactions in DB, syncing with Plaid");
        const plaidResults: any = await PlaidApi.syncTransactions(token);

        if (plaidResults && plaidResults.transactions) {
          setTransaction(plaidResults.transactions);
          setAccounts(plaidResults.accounts || []);
          console.log(`Synced ${plaidResults.transactions.length} transactions from Plaid`);
        } else if (Array.isArray(plaidResults)) {
          setTransaction(plaidResults);
          console.log(`Received ${plaidResults.length} transactions from Plaid`);
        }
      }

      // Update last fetch time
      setLastFetchTime(now);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  // Fetch transactions when user is available
  useEffect(() => {
    if (user?.id) {
      fetchTransactions();

      // Set up interval for periodic transaction updates (every 30 minutes)
      const intervalId = setInterval(() => {
        fetchTransactions();
      }, 30 * 60 * 1000); // 30 minutes

      // Clean up on unmount
      return () => clearInterval(intervalId);
    }
  }, [user?.id]);

  // For debugging in development
  useEffect(() => {
    if (transactions.length > 0) {
      console.log(`TransactionsContext has ${transactions.length} transactions available`);
    }
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransaction,
        fetchTransactions,
        isTransactionLoading,
        setIsTransactionLoading,
        accounts,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};