"use client"
import React from "react";
import RecentTransactions from "./components/RecentTransactions";
import { PieChartSpending } from "./components/PieChartSpending";
import AuthRequired from "./components/LoggedOutHome";
import { useAuth } from "./context/AuthContext";
import PlaidLink from "./components/PlaidLink";
export default function Home() {
  const {user} = useAuth()
  return (
    <div>
      {!user ? (
        <AuthRequired />
      ) : (
        <>
          <PlaidLink />
          <RecentTransactions />
          <PieChartSpending />
        </>
      )}
    </div>
  );
}
