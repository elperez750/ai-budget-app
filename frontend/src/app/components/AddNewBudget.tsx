"use client"

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { transactions } from "../data/TransactionData";
import { useBudget } from "../context/BudgetsContext";


const categoryValues = [...new Set(transactions.filter((transaction) => transaction.type === "expense").map(transactions => transactions.category))]

const AddNewBudget = () => {
const [open, setOpen] = useState(false);

  const [category, setCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const {budgets, addBudget} = useBudget()



  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // Clear alert when user makes changes
    if (showAlert) setShowAlert(false);
  };

  const handleBudgetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setBudgetAmount(amount);
    // Clear alert when user makes changes
    if (showAlert) setShowAlert(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!category) {
      setAlertMessage("Please select a category");
      setShowAlert(true);
      return;
    }

    if (!budgetAmount || isNaN(budgetAmount)) {
      setAlertMessage("Please enter a valid budget amount");
      setShowAlert(true);
      return;
    }

    // If we get here, form is valid
    addBudget({
        id: Math.random() * 100,
        category: category,
        budget: budgetAmount
    })


    
    console.log(budgets)
    console.log("Form submitted:", { category, budgetAmount });
    // Add your logic to save the budget
    
    // Reset form
    setOpen(false);
    setCategory("");
    setBudgetAmount(null);
    setShowAlert(false);
    // Close dialog if needed
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add new budget</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new budget</DialogTitle>
            <DialogDescription>
              Set a budget for a specific category to track your spending.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {showAlert && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={handleCategoryChange} value={category}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {categoryValues.map((value) => (
                        <SelectItem value={value} key={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget-amount" className="text-right">
                  Budget Amount
                </Label>
                <div className="relative col-span-3">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <Input
                    id="budget-amount"
                    type="number"
                    className="pl-6"
                    onChange={handleBudgetAmountChange}
                    value={budgetAmount || ""}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewBudget;