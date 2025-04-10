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
  fetchTransactions: () => void;
  isTransactionLoading: boolean;
  setIsTransactionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasSynced: boolean;
  setHasSynced: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  setTransaction: () => {},
  fetchTransactions: () => {},
  isTransactionLoading: true,
  setIsTransactionLoading: () => {},
  hasSynced: false,
  setHasSynced: () => {},
});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransaction] = useState<TransactionType[]>([]);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [hasSynced, setHasSynced] = useState(false);

  const { hasAccessToken } = usePlaid();




  const fetchFromDatabase = async () => {
    const token = await hasAccessToken();
    if (!token) return;

    try {

      setIsTransactionLoading(true);
      const response: any = await PlaidApi.fetchTransactionsFromDB(token);
      setTransaction(response);
    } catch (err) {
      console.error("DB fetch error:", err);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const syncWithPlaid = async () => {
    const token = await hasAccessToken();

    if (!token) return;

    try {
      setIsTransactionLoading(true);
      const response: any = await PlaidApi.syncTransactions(token);
      setTransaction(response);
      localStorage.setItem("hasSynced", "true");
      setHasSynced(true);
    } catch (err) {
      console.error("Plaid sync error:", err);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const fetchTransactions = async () => {
    const token = await hasAccessToken();

    if (!token) {
      console.error("Missing access token");
      return;
    }

    hasSynced ? await fetchFromDatabase() : await syncWithPlaid();
  };

  useEffect(() => {
    const checkTokenAndSync = async () => {
      const token = await hasAccessToken();
      
      // Only access localStorage in the browser
      const rawSyncStatus = localStorage.getItem("hasSynced");
      const isSynced = rawSyncStatus === "true";
      setHasSynced(isSynced);
      
      if (token) {
        if (isSynced) {
          await fetchFromDatabase();
        } else {
          await syncWithPlaid();
        }
      } else {
        setIsTransactionLoading(false);
      }
    };
    
    checkTokenAndSync();
  }, []); // Empty dependency array to run only once on mount
  
  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransaction,
        fetchTransactions,
        isTransactionLoading,
        setIsTransactionLoading,
        hasSynced,
        setHasSynced,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
