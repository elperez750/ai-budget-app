"use client";

import React, { useState } from "react";
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import QuickFilters from "../components/QuickFilters";
import AdvancedFilters from "../components/AdvancedFilters";


interface TransactionType {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
  account: string;
  type: string;
}



interface FilterType {
  fromDate: string;
  toDate: string;
  category: string;
  account: string;
  type: string;
}


// Mock data for transactions


const Page = () => {
  
  return (
    <div className="flex flex-col p-4">
      <Card className="p-2">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter your transactions by date, category, or account
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="filters" className="">


     <QuickFilters />
     <AdvancedFilters />

      
         
        </Tabs>

      </Card>

    </div>
  );
};

export default Page;
