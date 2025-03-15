import React, { SetStateAction, Dispatch } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs } from '@/components/ui/tabs'; 
import QuickFilters from './QuickFilters';
import AdvancedFilters from './AdvancedFilters';


const FilterCard = () => {
  return (
    <div>
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
  )
}

export default FilterCard
