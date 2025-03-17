import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

const BudgetMain = () => {
  return (
    <div>
      <Tabs defaultValue="budget-categories" className="">
        <TabsList>
          <TabsTrigger value="budget-categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="financial-goals">Financial Goals</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default BudgetMain;
