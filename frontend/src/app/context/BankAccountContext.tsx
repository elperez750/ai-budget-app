"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { usePlaid } from "./PlaidContext";
import { useAuth } from "./AuthContext";
import {
  BankAccountContextType,
  BankAccountType,
} from "../types/BankAccountTypes";
import { BankAccountsApi } from "../../utils/BankAccountsApi";
export const BankAccountContext = createContext<BankAccountContextType>({
  bankAccounts: [],
  setBankAccounts: () => {},
  fetchBankAccounts: async () => {},
  isBankAccountLoading: false,
  setIsBankAccountLoading: () => {},
});

export const useBankAccounts = () => useContext(BankAccountContext);

export const BankAccountProvider = ({ children }: { children: ReactNode }) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([]);
  const [isBankAccountLoading, setIsBankAccountLoading] = useState(false);
  const { hasAccessToken } = usePlaid();
  const { user } = useAuth();

  // Function to fetch transactions
  const fetchBankAccounts = async () => {
    // Get access token
    const token = await hasAccessToken();
    console.log("Fetch bank accounts with token:", token);
    if (!token) return;

    setIsBankAccountLoading(true);

    try {
      // Try database first
      console.log("Attempting to fetch from DB with token:", token);
      console.log("API URL:", `/api/bank_accounts/fetch_bank_accounts_from_db/?accessToken=${token}`);
      const dbResponse: any = await BankAccountsApi.fetchBankAccountsFromDB(
        token
      );
      console.log("DB Response:", dbResponse);
      const dbResults = dbResponse.data;
      console.log("DB Results:", dbResults);

      if (
        dbResults &&
        dbResults.bankAccounts &&
        dbResults.bankAccounts.length > 0
      ) {
        console.log("Setting accounts from DB:", dbResults.bankAccounts);
        setBankAccounts(dbResults.bankAccounts);
      } else {
        console.log("No accounts in DB, syncing from Plaid");
        const plaidResponse: any = await BankAccountsApi.syncBankAccounts(
          token
        );
        console.log("Plaid Response:", plaidResponse);
        const plaidResults = plaidResponse.data;
        console.log("Plaid Results:", plaidResults);

        if (
          plaidResults &&
          plaidResults.bankAccounts &&
          plaidResults.bankAccounts.length > 0
        ) {
          console.log("Setting accounts from Plaid bankAccounts:", plaidResults.bankAccounts);
          setBankAccounts(plaidResults.bankAccounts);
        } else if (plaidResults && plaidResults.accounts && Array.isArray(plaidResults.accounts)) {
          console.log("Setting accounts from Plaid accounts array:", plaidResults.accounts);
          setBankAccounts(plaidResults.accounts);
        } else if (Array.isArray(plaidResults)) {
          console.log("Setting accounts from Plaid array:", plaidResults);
          setBankAccounts(plaidResults);
        } else {
          console.log("No recognizable format in Plaid response:", plaidResults);
        }
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setIsBankAccountLoading(false);
    }
  };

  // Fetch bank accounts when user is available
  useEffect(() => {
    console.log("BankAccountContext useEffect triggered", { userId: user?.id });
    if (user?.id) {
      console.log("User ID available, fetching bank accounts");
      fetchBankAccounts();
    }
  }, [user?.id]);

  return (
    <BankAccountContext.Provider
      value={{
        bankAccounts,
        setBankAccounts,
        fetchBankAccounts,
        isBankAccountLoading,
        setIsBankAccountLoading,
      }}
    >
      {children}
    </BankAccountContext.Provider>
  );
};
