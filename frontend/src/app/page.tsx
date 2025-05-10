"use client";
import React, { useEffect } from "react";
import AuthReqired from "./components/dashboard/LoggedOutHome";
import { useAuth } from "./context/AuthContext";
import { useBudget } from "./context/BudgetContext";
import { usePlaid } from "./context/PlaidContext";
import LoadingComponent from "./components/misc/LoadingComponent";

import NotSynced from "./components/plaid/NotSynced";
import HasSynced from "./components/dashboard/HasSynced";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { budgets, fetchBudgets } = useBudget();
  const { hasAccessToken, isSynced, setIsSynced } = usePlaid();

  // Fetch budgets when the component mounts
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await hasAccessToken();
      setIsSynced(!!accessToken);
    };

    checkAccessToken();
  }, []);



  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!user) return <AuthReqired />;

  if (!isSynced) return <NotSynced />;
  // Show different content based on authentication status
  return <HasSynced />;
}
