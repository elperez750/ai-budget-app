import React, { useState } from "react";
import {  TabsContent } from "@/components/ui/tabs";
import { transactions } from "../data/TransactionData";
import DatePicker from "./DatePicker";
import FilterDropdown from "./FilterDropdown";


const uniqueCategories = [
  ...new Set(transactions.map((transactions) => transactions.category)),
];

const uniqueTypes = [
  ...new Set(transactions.map((transactions) => transactions.type)),
];

interface FilterType {
  fromDate: string;
  toDate: string;
  category: string;
  account: string;
  type: string;
}

const AdvancedFilters = () => {
  const [filters, setFilters] = useState<FilterType>({
    fromDate: "",
    toDate: "",
    category: "all",
    account: "all",
    type: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    console.log(key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <TabsContent value="advanced-filters">
        <div className="flex w-1/2 space-x-1 p-1">
          <DatePicker
            label="From"
            date={filters.fromDate}
            onSelect={(date) => handleFilterChange("fromDate", date)}
          />
          <DatePicker
            label="To"
            date={filters.toDate}
            onSelect={(date) => handleFilterChange("toDate", date)}
          />
        </div>


        <FilterDropdown
          label="Category"
          valueArray={uniqueCategories}
          valueChange={(value) => handleFilterChange("category", value)}
        />
        <FilterDropdown
          label="Type"
          valueArray={uniqueTypes}
          valueChange={(value) => handleFilterChange("type", value)}
        />

      </TabsContent>
    </div>
  );
};

export default AdvancedFilters;
