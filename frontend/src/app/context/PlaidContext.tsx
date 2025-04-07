"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PlaidApi } from "../../utils/PlaidApi";
import { useAuth } from "./AuthContext";
interface PlaidContextType {
  accessToken: string | null; // Access token from Plaid
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>; // Function to set the access token in state
  linkToken: string | null; // Link token for Plaid Link
  generateLinkToken: () => Promise<void>; // Function to fetch the link token
  exchangePublicToken: (publicToken: string) => Promise<void>; // Function to exchange public token for access token
  isLinkLoading: boolean; // Optional: Loading state for the link process
  setIsLinkLoading: React.Dispatch<React.SetStateAction<boolean>>; // Function to set loading state
  hasAccessToken: () => Promise<string | null>; // Function to check if access token exists
}

const PlaidContext = createContext<PlaidContextType>({
  accessToken: null, // Default value for access token
  setAccessToken: () => {}, // Provide a no-op function to avoid undefined errors in the context consumer
  linkToken: null, // Default value for link token
  generateLinkToken: async () => {},
  exchangePublicToken: async () => {},
  isLinkLoading: false,
  setIsLinkLoading: () => {}, // Provide a no-op function to avoid undefined errors in the context consumer
  hasAccessToken: async () => null,
});



export function PlaidProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null); // State for access token
  const [linkToken, setLinkToken] = useState<string | null>(null); // State for link token
  const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false); // Optional: Loading state for the link process
  const { user } = useAuth(); // Get the user from AuthContext, ensure user is authenticated

  async function hasAccessToken() {
    if (!user) {
      console.error("User is not authenticated or user ID is missing");
      return null; // Return null if user is not authenticated
    } else {
      try {
        const response: any = await PlaidApi.hasAccessToken(); // Call the API to check if access token exists
        if (response.access_token) {
          console.log("Access token exists for user:", user.id);
          setAccessToken(response.access_token); // Set the access token in state
          return response.access_token; // Return the access token if it exists
        } else {
          console.log("No access token found for user:", user.id);
          return null; // Return null if no access token exists
        }
      } catch (error) {
        console.error("Error checking for access token:", error); // Log any errors
        return null; // Return null in case of an error
      }
    }
  }

  async function generateLinkToken() {
    console.log(user?.id);
    // Ensure user is authenticated before fetching the link token
    if (!user) {
      console.error("User is not authenticated or user ID is missing");
      return;
    }

    try {
      setIsLinkLoading(true);
      // Make a request to your Django backend
      const { linkToken } = await PlaidApi.createLinkToken(user.id);
      // Store the link token
      setLinkToken(linkToken);
      console.log("Link token fetched successfully:", linkToken);
    } catch (error) {
      console.error("Error fetching link token:", error);
    } finally {
      setIsLinkLoading(false);
    }
  }

  async function exchangePublicToken(publicToken: string) {
    if (!publicToken) {
      console.error("Public token is required to exchange for access token");
      return;
    }
    try {
      setIsLinkLoading(true);
      // Exchange the public token for an access token
      const { access_token } = await PlaidApi.exchangePublicToken(publicToken);
      // Store the access token
      console.log("Access token received:", access_token); // Log the access token for debugging
      setAccessToken(access_token);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    } finally {
      setIsLinkLoading(false);
    }
  }

  return (
    <PlaidContext.Provider
      value={{
        accessToken,
        linkToken,
        setAccessToken,
        generateLinkToken,
        exchangePublicToken,
        isLinkLoading,
        setIsLinkLoading,
        hasAccessToken,
      }}
    >
      {children}
    </PlaidContext.Provider>
  );
}

export const usePlaid = () => useContext(PlaidContext);
