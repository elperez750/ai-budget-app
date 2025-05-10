"use client";

import React from "react";
import TransactionsHistory from "../components/transaction/TransactionsHistory";
import FilterCard from "../components/transaction/FilterCard";
import { FilterProvider } from "../context/FilterContext"; // Import the Provider
import ProtectedRoute from "../components/misc/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <FilterProvider>
        <div className="flex flex-col p-4">
          <FilterCard />
          <TransactionsHistory />
        </div>
      </FilterProvider>
    </ProtectedRoute>
  );
};

export default Page;
