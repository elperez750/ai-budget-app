import { FilterType } from "../context/FilterContext";


export interface TransactionType {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  type: string;
 
}

export const transactions = [
  { id: "t1", date: "2025-03-12", description: "Grocery Store", category: "Food & Dining", account: "Chase Checking", amount: -85.32, type: "expense" },
  { id: "t2", date: "2025-03-11", description: "Gas Station", category: "Transportation", account: "Visa Card", amount: -42.76, type: "expense" },
  { id: "t3", date: "2025-03-10", description: "Salary Deposit", category: "Income", account: "Bank of America", amount: 2350.0, type: "income" },
  { id: "t4", date: "2025-03-09", description: "Electric Bill", category: "Utilities", account: "Chase Checking", amount: -94.76, type: "expense" },
  { id: "t5", date: "2025-03-08", description: "Amazon.com", category: "Shopping", account: "Amex Card", amount: -67.99, type: "expense" },
  { id: "t6", date: "2025-03-07", description: "Uber Ride", category: "Transportation", account: "Visa Card", amount: -24.5, type: "expense" },
  { id: "t7", date: "2025-03-06", description: "Spotify Subscription", category: "Entertainment", account: "Visa Card", amount: -9.99, type: "expense" },
  { id: "t8", date: "2025-03-05", description: "Freelance Payment", category: "Income", account: "Chase Checking", amount: 350.0, type: "income" },
  { id: "t9", date: "2025-03-04", description: "Gas Station", category: "Transportation", account: "Visa Card", amount: -45.87, type: "expense" },
  { id: "t10", date: "2025-03-03", description: "Gym Membership", category: "Fitness", account: "Amex Card", amount: -49.99, type: "expense" },
  { id: "t11", date: "2025-03-02", description: "Netflix Subscription", category: "Entertainment", account: "Amex Card", amount: -15.99, type: "expense" },
  { id: "t12", date: "2025-03-01", description: "Rent Payment", category: "Housing", account: "Chase Checking", amount: -1200.0, type: "expense" },
  { id: "t13", date: "2025-02-28", description: "Dividend Payment", category: "Investments", account: "Investment Account", amount: 32.41, type: "income" },
  { id: "t14", date: "2025-02-27", description: "Restaurant", category: "Food & Dining", account: "Amex Card", amount: -78.65, type: "expense" },
  { id: "t15", date: "2025-02-26", description: "Car Loan Payment", category: "Loans", account: "Chase Checking", amount: -350.0, type: "expense" },
  { id: "t16", date: "2025-02-25", description: "Bonus Payment", category: "Income", account: "Bank of America", amount: 500.0, type: "income" },
  { id: "t17", date: "2025-02-24", description: "Coffee Shop", category: "Food & Dining", account: "Visa Card", amount: -6.75, type: "expense" },
  { id: "t18", date: "2025-02-23", description: "Phone Bill", category: "Utilities", account: "Chase Checking", amount: -79.99, type: "expense" },
  { id: "t19", date: "2025-02-22", description: "Target Purchase", category: "Shopping", account: "Amex Card", amount: -129.5, type: "expense" },
  { id: "t20", date: "2025-02-21", description: "YouTube Premium", category: "Entertainment", account: "Visa Card", amount: -11.99, type: "expense" },
  { id: "t21", date: "2025-02-20", description: "Investment Profit", category: "Investments", account: "Investment Account", amount: 280.0, type: "income" },
  { id: "t22", date: "2025-02-19", description: "Medical Bill", category: "Healthcare", account: "Chase Checking", amount: -200.0, type: "expense" },
  { id: "t23", date: "2025-02-18", description: "Bus Pass", category: "Transportation", account: "Visa Card", amount: -50.0, type: "expense" },
  { id: "t24", date: "2025-02-17", description: "Hulu Subscription", category: "Entertainment", account: "Amex Card", amount: -7.99, type: "expense" },
  { id: "t25", date: "2025-02-16", description: "Clothing Store", category: "Shopping", account: "Visa Card", amount: -98.45, type: "expense" },
  { id: "t26", date: "2025-02-15", description: "Car Maintenance", category: "Automotive", account: "Chase Checking", amount: -180.0, type: "expense" },
  { id: "t27", date: "2025-02-14", description: "Birthday Gift", category: "Gifts", account: "Amex Card", amount: -45.0, type: "expense" },
  { id: "t28", date: "2025-02-13", description: "Freelance Work", category: "Income", account: "Bank of America", amount: 600.0, type: "income" },
  { id: "t29", date: "2025-02-12", description: "Home Internet", category: "Utilities", account: "Chase Checking", amount: -59.99, type: "expense" },
  { id: "t30", date: "2025-02-11", description: "Apple Store", category: "Shopping", account: "Visa Card", amount: -1200.0, type: "expense" },
  { id: "t31", date: "2025-02-10", description: "Gas Station", category: "Transportation", account: "Visa Card", amount: -40.0, type: "expense" },
  { id: "t32", date: "2025-02-09", description: "Hotel Booking", category: "Travel", account: "Amex Card", amount: -350.0, type: "expense" },
  { id: "t33", date: "2025-02-08", description: "Stock Sale", category: "Investments", account: "Investment Account", amount: 1400.0, type: "income" },
  { id: "t34", date: "2025-02-07", description: "Lunch with Friends", category: "Food & Dining", account: "Visa Card", amount: -35.75, type: "expense" },
  { id: "t35", date: "2025-02-06", description: "Concert Tickets", category: "Entertainment", account: "Amex Card", amount: -120.0, type: "expense" },
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

    // Filter by account
    const matchesAccount =
      filters.account === "All" || transaction.account === filters.account;

    // Filter by type
    const matchesType =
      filters.type === "All" || transaction.type === filters.type;

    // Include the transaction only if all conditions are met
    return isWithinDateRange && matchesCategory && matchesAccount && matchesType;
  });
};


