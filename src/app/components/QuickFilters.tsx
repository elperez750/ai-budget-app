import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const dates: string[] = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Last Month",
  "Last 3 Months",
];

const QuickFilters = () => {
  return (
    <>
      <TabsList>
        <TabsTrigger value="filters">Filters</TabsTrigger>
        <TabsTrigger value="advanced-filters">Advanced Filters</TabsTrigger>
      </TabsList>

      <TabsContent value="filters">
        <div className="grid grid-cols-3 grid-flow-row gap-2 p-2">
          {dates.map((date: string) => (
            <Button
              className="m-1 bg-white text-black border-2 border-gray-400 
                         hover:bg-gray-100 hover:border-gray-500 hover:shadow-md 
                         transition-all duration-200 ease-in-out 
                         text-sm py-1 px-2" // Smaller button size
              key={date}
            >
              {date}
            </Button>
          ))}
        </div>
      </TabsContent>
    </>
  );
};

export default QuickFilters;
