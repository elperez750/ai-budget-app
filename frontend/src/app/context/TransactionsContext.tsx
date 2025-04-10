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

export type TransactionType = {
  transaction_id: string;
  name: string;
  date: string;
  amount: number;
  category: string;
  logo_url: string;
  currency: string;
};

interface TransactionContextType {
  transactions: TransactionType[];
  setTransaction: React.Dispatch<React.SetStateAction<TransactionType[]>>;
  fetchTransactions: () => Promise<void>;
  isTransactionLoading: boolean;
  setIsTransactionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  accounts: any[];
}

const TransactionContext = createContext<TransactionContextType>({
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

  const { hasAccessToken } = usePlaid();
  const { user } = useAuth();

  // Function to fetch transactions
  const fetchTransactions = async () => {
    // Get access token
    const token = await hasAccessToken();
    if (!token) return;
    
    setIsTransactionLoading(true);
    
    try {
      // Try database first
      const dbResults: any = await PlaidApi.fetchTransactionsFromDB(token);
      
      // If database has transactions, use them
      if (dbResults && dbResults.transactions.length > 0) {
        setTransaction(dbResults.transactions);
        setAccounts(dbResults.accounts || []);
      } 
      // Otherwise sync with Plaid
      else {
        const plaidResults: any = await PlaidApi.syncTransactions(token);
        
        if (plaidResults && plaidResults.transactions) {
          setTransaction(plaidResults.transactions);
          setAccounts(plaidResults.accounts || []);
        } else if (Array.isArray(plaidResults)) {
          setTransaction(plaidResults);
        }
      }
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
    }
  }, [user?.id]);

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