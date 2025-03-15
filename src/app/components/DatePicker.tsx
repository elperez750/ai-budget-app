"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useFilters } from "../context/FilterContext";

interface DatePickerProps {
  label: string;
  date: string;
  isDisabled?: boolean;
  onSelect: (date: string) => void;
}

const DatePicker = ({
  label,
  date,
  isDisabled = false,
  onSelect,
}: DatePickerProps) => {
  

  const { filters } = useFilters();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 w-full justify-start text-left font-normal ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isDisabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(new Date(`${date}T00:00:00`), "PPP") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date ? new Date(`${date}T00:00:00`) : undefined}
          onSelect={(selectedDate) => {

            if (selectedDate) {


              const localDate = new Date(selectedDate);
              const fromDate = new Date(filters.fromDate)

              if (localDate < fromDate) {
                console.log("Cannot set date")
              }
              else{

                localDate.setHours(12);
                onSelect(format(localDate, "yyyy-MM-dd"));
              }
            } 
            else {
              onSelect("");
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
export default DatePicker;
