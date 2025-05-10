import { FilterType } from "../context/FilterContext";
import { TransactionType } from "../types/TransactionTypes"; 

// Mock transaction data that matches the TransactionType interface
export const mockTransactions: TransactionType[] = [
  { 
    transaction_id: "t1", 
    name: "Walmart Grocery", 
    date: "2025-04-15", 
    amount: 85.32, 
    category: "Food & Dining", 
    logo_url: "https://logo.clearbit.com/walmart.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t2", 
    name: "Shell Gas Station", 
    date: "2025-04-14", 
    amount: 42.76, 
    category: "Transportation", 
    logo_url: "https://logo.clearbit.com/shell.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t3", 
    name: "Monthly Salary", 
    date: "2025-04-10", 
    amount: 3500.00, 
    category: "Income", 
    logo_url: "", 
    currency: "USD" 
  },
  { 
    transaction_id: "t4", 
    name: "ConEd Electric", 
    date: "2025-04-09", 
    amount: 94.76, 
    category: "Utilities", 
    logo_url: "https://logo.clearbit.com/coned.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t5", 
    name: "Amazon.com", 
    date: "2025-04-08", 
    amount: 67.99, 
    category: "Shopping", 
    logo_url: "https://logo.clearbit.com/amazon.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t6", 
    name: "Uber Ride", 
    date: "2025-04-07", 
    amount: 24.50, 
    category: "Transportation", 
    logo_url: "https://logo.clearbit.com/uber.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t7", 
    name: "Spotify Premium", 
    date: "2025-04-06", 
    amount: 9.99, 
    category: "Entertainment", 
    logo_url: "https://logo.clearbit.com/spotify.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t8", 
    name: "Freelance Payment", 
    date: "2025-04-05", 
    amount: 350.00, 
    category: "Income", 
    logo_url: "", 
    currency: "USD" 
  },
  { 
    transaction_id: "t9", 
    name: "Exxon Gas", 
    date: "2025-04-04", 
    amount: 45.87, 
    category: "Transportation", 
    logo_url: "https://logo.clearbit.com/exxon.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t10", 
    name: "Lifetime Fitness", 
    date: "2025-04-03", 
    amount: 49.99, 
    category: "Fitness", 
    logo_url: "https://logo.clearbit.com/lifetime.life", 
    currency: "USD" 
  },
  { 
    transaction_id: "t11", 
    name: "Netflix Subscription", 
    date: "2025-04-02", 
    amount: 15.99, 
    category: "Entertainment", 
    logo_url: "https://logo.clearbit.com/netflix.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t12", 
    name: "Apartment Rent", 
    date: "2025-04-01", 
    amount: 1200.00, 
    category: "Housing", 
    logo_url: "", 
    currency: "USD" 
  },
  { 
    transaction_id: "t13", 
    name: "Stock Dividend", 
    date: "2025-03-31", 
    amount: 32.41, 
    category: "Investments", 
    logo_url: "", 
    currency: "USD" 
  },
  { 
    transaction_id: "t14", 
    name: "Cheesecake Factory", 
    date: "2025-03-30", 
    amount: 78.65, 
    category: "Food & Dining", 
    logo_url: "https://logo.clearbit.com/thecheesecakefactory.com", 
    currency: "USD" 
  },
  { 
    transaction_id: "t15", 
    name: "Car Loan Payment", 
    date: "2025-03-29", 
    amount: 350.00, 
    category: "Transportation", 
    logo_url: "", 
    currency: "USD" 
  }
];

// Helper functions
export const uniqueCategories = [
  ...new Set(mockTransactions.map((transaction) => transaction.category)),
];

export const uniqueTypes = [
  "income", "expense"
];

export const uniqueAccounts = [
  "Checking Account", "Savings Account", "Credit Card"
];

export const filterTransactions = (
  transactions: TransactionType[],
  filters: FilterType
): TransactionType[] => {
  return transactions.filter((transaction) => {
    // Filter by date range
    const isWithinDateRange =
      (!filters.fromDate || transaction.date >= filters.fromDate) &&
      (!filters.toDate || transaction.date <= filters.toDate);

    // Filter by category
    const matchesCategory =
      filters.category === "All" || transaction.category === filters.category;

    // Include the transaction only if all conditions are met
    return isWithinDateRange && matchesCategory;
  });
};