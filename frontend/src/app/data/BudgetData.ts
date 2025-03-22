import { transactions, TransactionType } from "./TransactionData";

export interface BudgetType {
    id: number;
    category: string;
    budget: number;
}


export const budgets: BudgetType[] = [
    {id: 0, category: "Housing", budget: 1200.00},
    {id: 1, category: "Food & Dining", budget:350.00},
    {id: 2, category: "Transportation", budget:500.00}
]



  

