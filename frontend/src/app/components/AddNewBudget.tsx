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
import { useBudget } from "../context/BudgetContext"
import NewBudgetForm from "./NewBudgetForm";
const categoryValues = [...new Set(transactions.filter((transaction) => transaction.type === "expense").map(transactions => transactions.category))]

const AddNewBudget = () => {

  return (
    
      <NewBudgetForm />
    
  );
};

export default AddNewBudget;