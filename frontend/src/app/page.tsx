"use client"
import React from "react";
import RecentTransactions from "./components/RecentTransactions";
import { PieChartSpending } from "./components/PieChartSpending";
import AuthRequired from "./components/LoggedOutHome";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const {user} = useAuth()
  return (
    <div>
      {!user ? (
        <AuthRequired />
      ) : (
        <>
          <RecentTransactions />
          <PieChartSpending />
        </>
      )}
    </div>
  );
}
