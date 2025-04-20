import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

import { Button } from "../../components/ui/button";
import { Trash } from "lucide-react";
import { useBudget } from "../context/BudgetContext";
interface DeleteBudgetButtonProps {
    budgetId: number

}
const DeleteBudgetButton = ({budgetId}: DeleteBudgetButtonProps) => {
 const { deleteBudget } = useBudget();

  const handleDeleteBudget = () => {
    deleteBudget(budgetId);
    setOpen(false);

  };

  const [open, setOpen] = useState(false);
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash className="mr-2 h-2 w-2 text-sm" />
            Delete Budget
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              budget and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteBudgetButton;
