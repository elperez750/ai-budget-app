interface TransactionType {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    status: string;
    account: string;
    type: string;
  }


  export const transactions: TransactionType[] = [
    {
      id: "t1",
      date: "2025-03-12",
      description: "Grocery Store",
      category: "Food & Dining",
      amount: -85.32,
      status: "completed",
      account: "Chase Checking",
      type: "expense",
    },
    {
      id: "t2",
      date: "2025-03-10",
      description: "Salary Deposit",
      category: "Income",
      amount: 2350.0,
      status: "completed",
      account: "Bank of America",
      type: "income",
    },
    {
      id: "t3",
      date: "2025-03-09",
      description: "Electric Bill",
      category: "Utilities",
      amount: -94.76,
      status: "completed",
      account: "Chase Checking",
      type: "expense",
    },
    {
      id: "t4",
      date: "2025-03-08",
      description: "Amazon.com",
      category: "Shopping",
      amount: -67.99,
      status: "completed",
      account: "Amex Card",
      type: "expense",
    },
    {
      id: "t5",
      date: "2025-03-07",
      description: "Uber Ride",
      category: "Transportation",
      amount: -24.5,
      status: "completed",
      account: "Visa Card",
      type: "expense",
    },
    {
      id: "t6",
      date: "2025-03-05",
      description: "Starbucks",
      category: "Food & Dining",
      amount: -5.4,
      status: "completed",
      account: "Visa Card",
      type: "expense",
    },
    {
      id: "t7",
      date: "2025-03-05",
      description: "Freelance Payment",
      category: "Income",
      amount: 350.0,
      status: "completed",
      account: "Chase Checking",
      type: "income",
    },
    {
      id: "t8",
      date: "2025-03-03",
      description: "Gas Station",
      category: "Transportation",
      amount: -45.87,
      status: "completed",
      account: "Visa Card",
      type: "expense",
    },
    {
      id: "t9",
      date: "2025-03-02",
      description: "Netflix Subscription",
      category: "Entertainment",
      amount: -15.99,
      status: "completed",
      account: "Amex Card",
      type: "expense",
    },
    {
      id: "t10",
      date: "2025-03-01",
      description: "Rent Payment",
      category: "Housing",
      amount: -1200.0,
      status: "completed",
      account: "Chase Checking",
      type: "expense",
    },
    {
      id: "t11",
      date: "2025-02-28",
      description: "Dividend Payment",
      category: "Income",
      amount: 32.41,
      status: "completed",
      account: "Investment Account",
      type: "income",
    },
    {
      id: "t12",
      date: "2025-02-27",
      description: "Restaurant",
      category: "Food & Dining",
      amount: -78.65,
      status: "completed",
      account: "Amex Card",
      type: "expense",
    },
  ];
  