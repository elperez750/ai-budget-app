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
import { BudgetType } from "../types/BudgetTypes";
interface NoBudgetsYetProps {
  onCreateBudget: (budgetData: BudgetType) => void;
}




const NewBudgetForm = () => {
  const { user } = useAuth(); // Get the user from AuthContext, ensure user is authenticated
    const { budgets, createBudget } = useBudget();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    budget_name: "",
    budget_amount: "",
    budget_period: "monthly",
    budget_category: "general",
  });

  const [errors, setErrors] = useState({
    budget_name: "",
    budget_amount: "",
  });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (name in errors && errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    // Validate form
    const newErrors = {
      budget_name: "",
      budget_amount: "",
    };

    if (!formData.budget_name.trim()) {
      newErrors.budget_name = "Budget name is required";
    }

    if (
      !formData.budget_amount ||
      isNaN(Number(formData.budget_amount)) ||
      Number(formData.budget_amount) <= 0
    ) {
      newErrors.budget_amount = "Please enter a valid amount";
    }

    if (newErrors.budget_name || newErrors.budget_amount) {
      setErrors(newErrors);
      return;
    }

 

    createBudget({
        ...formData,
        budget_amount: Number(formData.budget_amount),

    });

    // Close modal and reset form
    setIsOpen(false);
    setFormData({
      budget_name: "",
      budget_amount: "",
      budget_period: "monthly",
      budget_category: "general",
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
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-left">
                Budget Name
              </Label>
              <Input
                id="name"
                name="budget_name"
                placeholder="e.g., Monthly Expenses, Vacation Fund"
                value={formData.budget_name}
                onChange={handleChange}
                className={errors.budget_name ? "border-red-500" : ""}
              />
              {errors.budget_name && (
                <p className="text-red-500 text-sm mt-1">{errors.budget_name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-left">
                Budget Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  name="budget_amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.budget_amount}
                  onChange={handleChange}
                  className={`pl-8 ${errors.budget_amount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.budget_amount && (
                <p className="text-red-500 text-sm mt-1">{errors.budget_amount}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period" className="text-left">
                Budget Period
              </Label>
              <Select
                value={formData.budget_period}
                onValueChange={(value) => handleSelectChange("budget_period", value)}
              >
                <SelectTrigger id="period">
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

            <div className="grid gap-2">
              <Label htmlFor="category" className="text-left">
                Category
              </Label>
              <Select
                value={formData.budget_category}
                onValueChange={(value) => handleSelectChange("budget_category", value)}
              >
                <SelectTrigger id="category">
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
