"use client"


import React, { createContext, useContext, useState, useEffect } from "react";
import { PlaidApi } from "../../utils/PlaidApi";
import { useAuth } from "./AuthContext";
interface PlaidContextType {
    accessToken: string | null; // Access token from Plaid
    linkToken: string | null; // Link token for Plaid Link
    generateLinkToken: () => Promise<void>; // Function to fetch the link token
    exchangePublicToken: (publicToken: string) => Promise<void>; // Function to exchange public token for access token
    isLinkLoading: boolean; // Optional: Loading state for the link process
    setIsLinkLoading: React.Dispatch<React.SetStateAction<boolean>>; // Function to set loading state
}

const PlaidContext = createContext<PlaidContextType>(
    {
        accessToken: null, // Default value for access token
        linkToken: null, // Default value for link token
        generateLinkToken: async () => {},
        exchangePublicToken: async () => {},
        isLinkLoading: false,
        setIsLinkLoading: () => {}, // Provide a no-op function to avoid undefined errors in the context consumer
    }
);


export function PlaidProvider({children}: {children: React.ReactNode}) {
    const [accessToken, setAccessToken] = useState<string | null>(null); // State for access token
    const [linkToken, setLinkToken] = useState<string | null>(null); // State for link token
    const [isLinkLoading, setIsLinkLoading] = useState<boolean>(false); // Optional: Loading state for the link process
    const { user } = useAuth(); // Get the user from AuthContext, ensure user is authenticated

  
    async function generateLinkToken() {
            console.log(user?.id)
            // Ensure user is authenticated before fetching the link token
            if (!user) {
              console.error('User is not authenticated or user ID is missing');
              return;
            }
    
          try {
            setIsLinkLoading(true);
            // Make a request to your Django backend
            const { linkToken } = await PlaidApi.createLinkToken(user.id)
            // Store the link token
            setLinkToken(linkToken);
            console.log('Link token fetched successfully:', linkToken);
          } catch (error) {
            console.error('Error fetching link token:', error);
          } finally {
            setIsLinkLoading(false);
          }
        }

    
    async function exchangePublicToken(publicToken: string) {
        if (!publicToken) {
            console.error('Public token is required to exchange for access token');
            return;
        }
        try {
            setIsLinkLoading(true);
            // Exchange the public token for an access token
            const { access_token } = await PlaidApi.exchangePublicToken(publicToken);
            // Store the access token
            console.log('Access token received:', access_token); // Log the access token for debugging
            setAccessToken(access_token);
        
        } catch (error) {
            console.error('Error exchanging public token:', error);
        } finally {
            setIsLinkLoading(false);
        }
    }
        
   
    return (
        <PlaidContext.Provider value={{ accessToken, linkToken, generateLinkToken, exchangePublicToken, isLinkLoading, setIsLinkLoading }}>
            {children}
        </PlaidContext.Provider>
    );

}


export const usePlaid = () => useContext(PlaidContext);
