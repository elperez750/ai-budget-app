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
import { PlusCircle, DollarSign } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { BudgetInputType } from "../context/BudgetContext";

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
      [name]: value,
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

    createBudget({
      ...formData,
      budgetAmount: parsedAmount,
    });

    setIsOpen(false);
    setFormData({
      budgetName: "",
      budgetAmount: "",
      budgetPeriod: "monthly",
      budgetCategory: "general",
    });
  };

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={`w-full h-14 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              isHovered ? "bg-gradient-to-r from-blue-600 to-blue-500 scale-[1.02] shadow-xl" : "bg-gradient-to-r from-blue-500 to-blue-400"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            {budgets ? "Create New Budget" : "Add Your First Budget"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="pt-6 px-6 pb-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
            <DialogTitle className="text-2xl font-bold">Create New Budget</DialogTitle>
            <DialogDescription className="text-blue-100">
              Set up a budget to help track and manage your expenses effectively.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6 space-y-6">
            {/* Budget Name */}
            <div className="space-y-2">
              <Label htmlFor="budgetName" className="text-sm font-medium">
                Budget Name
              </Label>
              <Input
                id="budgetName"
                name="budgetName"
                placeholder="e.g., Vacation Fund"
                value={formData.budgetName}
                onChange={handleChange}
                className={`w-full h-11 ${errors.budgetName ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-blue-200`}
              />
              {errors.budgetName && (
                <p className="text-red-500 text-sm">{errors.budgetName}</p>
              )}
            </div>

            {/* Budget Amount */}
            <div className="space-y-2">
              <Label htmlFor="budgetAmount" className="text-sm font-medium">
                Budget Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="budgetAmount"
                  name="budgetAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.budgetAmount}
                  onChange={handleChange}
                  className={`w-full h-11 pl-10 ${errors.budgetAmount ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-blue-200`}
                />
              </div>
              {errors.budgetAmount && (
                <p className="text-red-500 text-sm">{errors.budgetAmount}</p>
              )}
            </div>

            {/* Period and Category in a grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Period */}
              <div className="space-y-2">
                <Label htmlFor="budgetPeriod" className="text-sm font-medium">
                  Budget Period
                </Label>
                <Select
                  value={formData.budgetPeriod}
                  onValueChange={(value) => handleSelectChange("budgetPeriod", value)}
                >
                  <SelectTrigger id="budgetPeriod" className="h-11">
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
              <div className="space-y-2">
                <Label htmlFor="budgetCategory" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={formData.budgetCategory}
                  onValueChange={(value) => handleSelectChange("budgetCategory", value)}
                >
                  <SelectTrigger id="budgetCategory" className="h-11">
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
          </div>

          <DialogFooter className="px-6 py-4 bg-gray-50 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="px-6 bg-blue-500 hover:bg-blue-600"
            >
              Create Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewBudgetForm;