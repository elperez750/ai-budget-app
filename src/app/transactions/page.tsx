"use client";

import React from "react";
import TransactionsHistory from "../components/TransactionsHistory";
import FilterCard from "../components/FilterCard";
import { FilterProvider } from "../context/FilterContext"; // Import the Provider

const Page = () => {
  return (
    <FilterProvider>
      <div className="flex flex-col p-4">
        <FilterCard />
        <TransactionsHistory />
      </div>
    </FilterProvider>
  );
};

export default Page;
