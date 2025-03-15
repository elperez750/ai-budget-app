import React, { createContext, useContext, useState } from "react";

// Define Filter Type
export interface FilterType {
  fromDate: string;
  toDate: string;
  category: string;
  account: string;
  type: string;
}

// Create Context
interface FilterContextType {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}



const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Create Provider Component
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterType>({
    fromDate: "",
    toDate: "",
    category: "all",
    account: "all",
    type: "all",
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom Hook for Using the Filter Context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
