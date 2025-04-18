"use client"
import React from "react";
import RecentTransactions from "./components/RecentTransactions";
import AuthReqired from "./components/LoggedOutHome";
import { useAuth } from "./context/AuthContext";
import PlaidLink from "./components/PlaidLink";
import LoadingComponent from "./components/LoadingComponent";

export default function Home() {
  const { user, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingComponent />;
  }
  
  // Show different content based on authentication status
  return (
    <div>
      {user ? (
        // Authenticated user content
        <>
          <PlaidLink />
          <RecentTransactions />
        </>
      ) : (
        // Not authenticated user content
        <AuthReqired />
      )}
    </div>
  );
}