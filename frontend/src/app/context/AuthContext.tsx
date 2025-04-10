// contexts/AuthContext.tsx
"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserApi, UserType } from '../../utils/UserApi';
import { usePlaid } from './PlaidContext'; // Ensure this is imported to set the access token in PlaidApi after login
import { useTransactions } from './TransactionsContext'; // Ensure this is imported to set transactions after login

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const { setAccessToken } = usePlaid(); // Get the function to set access token from PlaidContext
  const { setTransaction } = useTransactions(); // Get the function to set transactions from TransactionsContext, if needed
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  

  // Check authentication status on initial load with detailed logging
  useEffect(() => {
    console.log("=====================================");
    console.log("AUTH CHECK STARTED ON PAGE LOAD/REFRESH");
    
    
    async function checkAuth() {
      try {
        console.log("Attempting to fetch user profile from /api/users/me endpoint");
        
        // Check if cookies exist first
        console.log("Cookies present in request:", document.cookie ? "Yes" : "No");
        
        // Make the request with detailed error handling
        try {
          const userData = await UserApi.getUserProfile();
          console.log("✅ User profile fetch successful:", userData);
          setUser(userData);
          console.log("User state updated with profile data");
        } catch (error: any) {
          console.error("❌ User profile fetch failed with error:", error);
          
          // Log more details about the error
          if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
            console.error("Response headers:", error.response.headers);
          } else if (error.request) {
            console.error("No response received. Request details:", error.request);
          } else {
            console.error("Error message:", error.message);
          }
          
          console.log("Setting user to null due to failed authentication check");
          setUser(null);
        }
      } finally {
        console.log("Auth check completed, setting isLoading to false");
        setIsLoading(false);
        console.log("=====================================");
      }
    }
    
    checkAuth();
  }, []);

  // Login function with enhanced logging
  const login = async (username: string, password: string) => {
    console.log("=====================================");
    console.log("LOGIN FUNCTION CALLED");
    console.log("Attempting login for username:", username);
    
    try {
      console.log("Making API request to login endpoint");
      const data = await UserApi.login(username, password);
      console.log("✅ Login API response received:", data);
      
      // Check if the response contains user data
      if (!data.username) {
        console.error("❌ API response missing user data:", data);
        return { success: false, error: "Invalid response format" };
      }
      
      console.log("Setting user state with:", data.username);
      setUser(data);
      console.log("Login completed successfully");
      console.log("=====================================");
      return { success: true };
      
    } catch (error: any) {
      console.error("❌ Login failed with error:", error);
      
      // Log more details about the error
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received. Request details:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      console.log("=====================================");
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function with enhanced logging
  const logout = async () => {
    console.log("=====================================");
    console.log("LOGOUT FUNCTION CALLED");
    
    try {
      console.log("Making API request to logout endpoint");
      await UserApi.logout();
      setAccessToken(null); // Clear the access token in Plaid context, if applicable
      setTransaction([]); // Clear transactions in the Transactions context, if applicable
      console.log("✅ Logout API call successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      console.log("Clearing user state regardless of logout API result");
      setUser(null);
      
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}