import { BankAccountType } from "../types/BankAccountTypes";

// Mock bank account data
export const mockBankAccounts: BankAccountType[] = [
  {
    account_id: "acc123456789",
    account_name: "Primary Checking",
    current_balance: 3542.87,
    available_balance: 3542.87,
    currency: "USD"
  },
  {
    account_id: "acc987654321",
    account_name: "High-Yield Savings",
    current_balance: 12750.50,
    available_balance: 12750.50, 
    currency: "USD"
  },
  {
    account_id: "acc456789123",
    account_name: "Credit Card",
    current_balance: -1248.36,
    available_balance: 3751.64,  // Remaining credit limit
    currency: "USD"
  }
];