import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { useFilters } from "../context/FilterContext"; // Import context
import { format } from "date-fns";


const dates: string[] = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Last Month",
  "Last 3 Months",
];

const QuickFilters = () => {
  const { filters, setFilters } = useFilters();

  const today = new Date()
  const handleDateChange = (date: string) => {
    if (date === "Today") {
      // Handle filter changes
      setFilters((prev) => ({
        ...prev,
        fromDate: String(format(today, "yyyy-MM-dd")),
        toDate: String(format(today, "yyyy-MM-dd")),
      }));
    }
    
    else if (date === "Yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      setFilters((prev) => ({
        ...prev, 
        fromDate: String(format(yesterday, "yyyy-MM-dd")),
        toDate: String(format(today, "yyyy-MM-dd"))
      }))
    }

    else if (date === "This Week") {
      const currentDay = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
      
      // Calculate days to subtract to get to Monday
      // If today is Sunday (0), we need to go back 6 days
      // If today is Monday (1), we need to go back 0 days
      // If today is Tuesday (2), we need to go back 1 day, etc.
      const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
      
      const monday = new Date(today);
      monday.setDate(today.getDate() - daysToSubtract);
      
      // Reset time part to start of day for Monday
      monday.setHours(0, 0, 0, 0);
      
      setFilters((prev) => ({
        ...prev,
        fromDate: format(monday, "yyyy-MM-dd"),
        toDate: format(today, "yyyy-MM-dd")
      }));
     
  }

  else if (date === "This Month") {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setFilters((prev) => ({
      ...prev,
      fromDate: format(firstDayOfMonth, "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd")
    }));
  }

  else if (date === "Last Month") {
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    setFilters((prev) => ({
      ...prev,
      fromDate: format(firstDayOfLastMonth, "yyyy-MM-dd"),
      toDate: format(lastDayOfLastMonth, "yyyy-MM-dd")
    }));
  }

  else {
    const firstDayOfFirstMonth = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    setFilters((prev) => ({
      ...prev,
      fromDate: format(firstDayOfFirstMonth, "yyyy-MM-dd"),
      toDate: format(today, "yyyy-MM-dd")
    }));
  }

}

  useEffect(() => {
    console.log(filters)
  }, [filters])

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
              onClick={() => handleDateChange(date)}
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
