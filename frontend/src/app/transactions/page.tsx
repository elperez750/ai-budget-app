"use client";

import React from "react";
import TransactionsHistory from "../components/TransactionsHistory";
import FilterCard from "../components/FilterCard";
import { FilterProvider } from "../context/FilterContext"; // Import the Provider
import ProtectedRoute from "../components/ProtectedRoute";

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
