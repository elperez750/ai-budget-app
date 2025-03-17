import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import { Label } from "@/components/ui/label";

interface FilterDropdownTypes {
    label: string;
    valueArray: string[];
    valueChange: (label: string) => void
    selectedValue: string
}

const FilterDropdown = ({label, valueArray, valueChange, selectedValue}: FilterDropdownTypes) => {
  return (
    <div className="w-full">
    <Label className="block mt-4 mb-2">{label}</Label>
      <Select
        onValueChange={(value) => valueChange(value)}
        value={selectedValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {valueArray.map((value) => (
            <SelectItem value={value} key={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default FilterDropdown
