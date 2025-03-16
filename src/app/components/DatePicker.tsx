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
import { toast } from "sonner"



interface DatePickerProps {
  label: string;
  date: string;
  isDisabled?: boolean;
  isToDate?: boolean; // Add this to identify if it's a "to" date picker
  onSelect: (date: string) => void;
}

const DatePicker = ({
  label,
  date,
  isDisabled = false,
  isToDate = false, // Default to false
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
              localDate.setHours(12);
              
              // Only validate if this is a "to" date picker and fromDate exists
              if (isToDate && filters.fromDate) {
                const fromDate = new Date(`${filters.fromDate}T12:00:00`);
                
                if (localDate < fromDate) {
                  toast.error("Cannot select a date earlier than the From date");
                  return; // Don't update the date
                }
              }
              
              onSelect(format(localDate, "yyyy-MM-dd"));
            } else {
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