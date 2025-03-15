import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { transactions } from "../data/TransactionData";
import DatePicker from "./DatePicker";
import FilterDropdown from "./FilterDropdown";
import { Button } from "@/components/ui/button";
import { useFilters } from "../context/FilterContext"; // Import context

// Get unique categories and types from transactions
const uniqueCategories = [
  ...new Set(transactions.map((transaction) => transaction.category)),
];

const uniqueTypes = [
  ...new Set(transactions.map((transaction) => transaction.type)),
];

const AdvancedFilters = () => {
  // Access filters and setFilters from context
  const { filters, setFilters } = useFilters();

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    console.log(key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log(filters);
  };

  return (
    <div>
      <TabsContent value="advanced-filters">
        {/* Date Pickers */}
        <div className="flex w-1/2 space-x-1 p-1">
          <DatePicker
            label="From"
            date={filters.fromDate}
            onSelect={(date) => handleFilterChange("fromDate", date)}
          />

          <DatePicker
            label="To"
            date={filters.toDate}
            isDisabled={filters.fromDate === ""}
            onSelect={(date) => handleFilterChange("toDate", date)}
          />
        </div>

        {/* Category Dropdown */}
        <FilterDropdown
          label="Category"
          valueArray={uniqueCategories}
          valueChange={(value) => handleFilterChange("category", value)}
        />

        {/* Type Dropdown */}
        <FilterDropdown
          label="Type"
          valueArray={uniqueTypes}
          valueChange={(value) => handleFilterChange("type", value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 p-2">
          <Button className="m-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md px-4 py-2 font-medium">
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            className="m-1 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-md px-4 py-2 font-medium"
          >
            Apply Filters
          </Button>
        </div>
      </TabsContent>
    </div>
  );
};

export default AdvancedFilters;
