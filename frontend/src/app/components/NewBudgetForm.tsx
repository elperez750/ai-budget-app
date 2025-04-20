import React, { useState } from "react";
import { useBudget } from "../context/BudgetContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { BudgetInputType } from "../context/BudgetContext";

// 👇 Redefine input type to match form state (budgetAmount as string for input handling)
type BudgetFormInput = Omit<BudgetInputType, "budgetAmount"> & { budgetAmount: string };

const NewBudgetForm = () => {
  const { user } = useAuth();
  const { budgets, createBudget } = useBudget();

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [formData, setFormData] = useState<BudgetFormInput>({
    budgetName: "",
    budgetAmount: "",
    budgetPeriod: "monthly",
    budgetCategory: "general",
  });

  const [errors, setErrors] = useState({
    budgetName: "",
    budgetAmount: "",
  });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // 👈 Keep as string for both fields
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: keyof BudgetFormInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const newErrors = {
      budgetName: "",
      budgetAmount: "",
    };

    if (!formData.budgetName.trim()) {
      newErrors.budgetName = "Budget name is required";
    }

    const parsedAmount = parseFloat(formData.budgetAmount);
    if (!formData.budgetAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.budgetAmount = "Please enter a valid amount";
    }

    if (newErrors.budgetName || newErrors.budgetAmount) {
      setErrors(newErrors);
      return;
    }

    // ✅ Pass valid number to createBudget
    createBudget({
      ...formData,
      budgetAmount: parsedAmount,
    });

    // Reset form
    setIsOpen(false);
    setFormData({
      budgetName: "",
      budgetAmount: "",
      budgetPeriod: "monthly",
      budgetCategory: "general",
    });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={`w-full py-6 transition-all duration-300 ${
              isHovered ? "bg-blue-600 scale-105" : "bg-blue-500"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <PlusCircle className="mr-2" size={20} />
            {budgets ? "Create New Budget" : "Add Your First Budget"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Set up a budget to help track and manage your expenses.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Budget Name */}
            <div className="grid gap-2">
              <Label htmlFor="budgetName">Budget Name</Label>
              <Input
                id="budgetName"
                name="budgetName"
                placeholder="e.g., Vacation Fund"
                value={formData.budgetName}
                onChange={handleChange}
                className={errors.budgetName ? "border-red-500" : ""}
              />
              {errors.budgetName && (
                <p className="text-red-500 text-sm mt-1">{errors.budgetName}</p>
              )}
            </div>

            {/* Budget Amount */}
            <div className="grid gap-2">
              <Label htmlFor="budgetAmount">Budget Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="budgetAmount"
                  name="budgetAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.budgetAmount}
                  onChange={handleChange}
                  className={`pl-8 ${errors.budgetAmount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.budgetAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.budgetAmount}</p>
              )}
            </div>

            {/* Period */}
            <div className="grid gap-2">
              <Label htmlFor="budgetPeriod">Budget Period</Label>
              <Select
                value={formData.budgetPeriod}
                onValueChange={(value) => handleSelectChange("budgetPeriod", value)}
              >
                <SelectTrigger id="budgetPeriod">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="budgetCategory">Category</Label>
              <Select
                value={formData.budgetCategory}
                onValueChange={(value) => handleSelectChange("budgetCategory", value)}
              >
                <SelectTrigger id="budgetCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="food">Food & Groceries</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="medical">Medical & Healthcare</SelectItem>
                  <SelectItem value="debt">Debt Payments</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Create Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewBudgetForm;
