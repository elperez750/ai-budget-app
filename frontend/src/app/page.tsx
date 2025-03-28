import React from "react";
import RecentTransactions from "./components/RecentTransactions";
import { PieChartSpending } from "./components/PieChartSpending";
import AuthRequired from "./components/LoggedOutHome";

export default function Home() {
  const showAuthRequired = true;
  return (
    <div>
      {showAuthRequired ? (
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
