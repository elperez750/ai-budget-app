import React, { useState, useEffect } from "react";
import { useBudget } from "../../context/BudgetContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { BudgetInputType } from "../../context/BudgetContext";
import { BudgetType } from "../../types/BudgetTypes";


type BudgetFormInput = Omit<BudgetInputType, "budgetAmount"> & { budgetAmount: string };

interface UpdateBudgetFormProps {
  budget: BudgetType;
}



const UpdateBudgetForm = ({ budget }: UpdateBudgetFormProps) => {
  const { user } = useAuth();
  const { updateBudget } = useBudget();

  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState<BudgetFormInput>({
    budgetName: budget.budgetName || "",
    budgetAmount: budget.budgetAmount?.toString() || "",
    budgetPeriod: budget.budgetPeriod || "monthly",
    budgetCategory: budget.budgetCategory || "general",
  });

  const [errors, setErrors] = useState({
    budgetName: "",
    budgetAmount: "",
  });

  // Update form data when budget prop changes
  useEffect(() => {
    setFormData({
      budgetName: budget.budgetName || "",
      budgetAmount: budget.budgetAmount?.toString() || "",
      budgetPeriod: budget.budgetPeriod || "monthly",
      budgetCategory: budget.budgetCategory || "general",
    });
  }, [budget]);

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


    const updateData: Partial<BudgetType> = {
        budgetName: formData.budgetName,
        budgetAmount: parsedAmount,
        budgetPeriod: formData.budgetPeriod,
        budgetCategory: formData.budgetCategory,
      };

      
    // Update budget with valid number
    updateBudget(budget.budgetId, updateData
    );

    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              Edit your budget details to better manage your expenses.
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
                  <SelectItem value="food">Food and Drink</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="fitness">Gyms and Fitness Centers</SelectItem>
    
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Update Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateBudgetForm;