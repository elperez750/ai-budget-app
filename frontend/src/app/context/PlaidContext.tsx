"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { PlaidApi } from "../../utils/PlaidApi";
import { useAuth } from "./AuthContext";

// ==============================
// Types
// ==============================
interface PlaidContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;

  linkToken: string | null;
  generateLinkToken: () => Promise<void>;
  exchangePublicToken: (publicToken: string) => Promise<void>;

  isLinkLoading: boolean;
  setIsLinkLoading: React.Dispatch<React.SetStateAction<boolean>>;

  hasAccessToken: () => Promise<string | null>;

  isSynced: boolean | null;
  setIsSynced: React.Dispatch<React.SetStateAction<boolean | null>>;
}

// ==============================
// Default Values
// ==============================
const PlaidContext = createContext<PlaidContextType>({
  accessToken: null,
  setAccessToken: () => {},

  linkToken: null,
  generateLinkToken: async () => {},
  exchangePublicToken: async () => {},

  isLinkLoading: false,
  setIsLinkLoading: () => {},

  hasAccessToken: async () => null,

  isSynced: null,
  setIsSynced: () => {},
});

// ==============================
// Provider
// ==============================
export function PlaidProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean | null>(null);

  const { user } = useAuth();

  // ==============================
  // Check if access token exists
  // ==============================
  async function hasAccessToken() {
    if (!user) {
      console.error("User not authenticated.");
      setIsSynced(false);
      return null;
    }

    try {
      const response: any = await PlaidApi.hasAccessToken();
      const token = response?.access_token || null;

      if (token) {
        setAccessToken(token);
        setIsSynced(true);
        return token;
      } else {
        setIsSynced(false);
        return null;
      }
    } catch (error) {
      console.error("Error checking access token:", error);
      setIsSynced(false);
      return null;
    }
  }

  // ==============================
  // Create link token
  // ==============================
  async function generateLinkToken() {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      setIsLinkLoading(true);
      const { linkToken } = await PlaidApi.createLinkToken(user.id);
      setLinkToken(linkToken);
    } catch (error) {
      console.error("Error creating link token:", error);
    } finally {
      setIsLinkLoading(false);
    }
  }

  // ==============================
  // Exchange public token
  // ==============================
  async function exchangePublicToken(publicToken: string) {
    if (!publicToken) {
      console.error("Missing public token.");
      return;
    }

    try {
      setIsLinkLoading(true);
      const { access_token } = await PlaidApi.exchangePublicToken(publicToken);
      setAccessToken(access_token);
      setIsSynced(true);
    } catch (error) {
      console.error("Error exchanging token:", error);
    } finally {
      setIsLinkLoading(false);
    }
  }

  return (
    <PlaidContext.Provider
      value={{
        accessToken,
        setAccessToken,
        linkToken,
        generateLinkToken,
        exchangePublicToken,
        isLinkLoading,
        setIsLinkLoading,
        hasAccessToken,
        isSynced,
        setIsSynced,
      }}
    >
      {children}
    </PlaidContext.Provider>
  );
}

// ==============================
// Hook to consume context
// ==============================
export const usePlaid = () => useContext(PlaidContext);
