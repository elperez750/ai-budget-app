"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import BudgetCategoryCard from "./BudgetCategoryCard";
import { TabsContent } from "@radix-ui/react-tabs";
import { useBudget } from "../context/BudgetsContext";

import AddNewBudget from "./AddNewBudget";
import { BudgetType } from "../data/BudgetData";

const BudgetMain = () => {

  const { budgets } = useBudget();

  useEffect(() => {
    console.log("change in budget data")
  }, [budgets])


  console.log(budgets)
  return (
    <div className="mt-5">
      <Tabs defaultValue="budget-categories" className="">
        <TabsList>
          <TabsTrigger value="budget-categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="financial-goals">Financial Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="budget-categories" className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl mb-5 font-bold">Budget Categories</h1>
            <AddNewBudget />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget: BudgetType) => (
              <BudgetCategoryCard key={budget.id} individualBudget={budget} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial-goals">
          <h1>Hello from financial goals</h1>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetMain;
