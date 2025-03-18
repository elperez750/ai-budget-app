"use client"

import React, {useState, useEffect} from "react";
import { TabsContent } from "@/components/ui/tabs";
import DatePicker from "./DatePicker";
import FilterDropdown from "./FilterDropdown";
import { Button } from "@/components/ui/button";
import { useFilters } from "../context/FilterContext"; // Import context
import { FilterType } from "../context/FilterContext";
import { uniqueAccounts, uniqueCategories, uniqueTypes } from "../data/TransactionData";


const AdvancedFilters = () => {

  const { filters, setFilters } = useFilters();
  const [tempFilters, setTempFilters] = useState<FilterType>({...filters}) 

  useEffect(() => {
    setTempFilters({...filters});
  }, []);
  

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    console.log(key, value);
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };


  const handleReset = () => {
    setTempFilters({
      fromDate: "",
      toDate: "",
      category: "All",
      type: "All",
      account: "All"
    });
  };


  const handleSubmit = () => {
    setFilters(tempFilters)
  };


  return (
    <div>
      <TabsContent value="advanced-filters">
        {/* Date Pickers */}
        <div className="flex w-1/2 space-x-1 p-1">
          <DatePicker
            label="From"
            date={tempFilters.fromDate}
            onSelect={(date) => handleFilterChange("fromDate", date)}
          />

          <DatePicker
            label="To"
            date={tempFilters.toDate}
            isToDate={true} // This flag tells the component to validate against fromDate

            isDisabled={tempFilters.fromDate === ""}
            onSelect={(date) => handleFilterChange("toDate", date)}
          />
        </div>

        {/* Category Dropdown */}
        <FilterDropdown
          label="Category"
          valueArray={uniqueCategories}
          valueChange={(value) => handleFilterChange("category", value)}
          selectedValue={tempFilters.category}
        />

        {/* Type Dropdown */}
        <FilterDropdown
          label="Type"
          valueArray={uniqueTypes}
          valueChange={(value) => handleFilterChange("type", value)}
          selectedValue={tempFilters.type}
        />


        <FilterDropdown
          label="Account"
          valueArray ={uniqueAccounts}
          valueChange={(value) => handleFilterChange("account" ,value)}
          selectedValue={tempFilters.account}
          />


        {/* Buttons */}
        <div className="flex justify-end gap-4 p-2">
          <Button
          onClick={handleReset} 
          className="m-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md px-4 py-2 font-medium">
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
