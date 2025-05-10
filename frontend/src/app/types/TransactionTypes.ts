export type TransactionType = {
  transaction_id: string;
  name: string;
  date: string;
  amount: number;
  category: string;
  logo_url: string;
  currency: string;
};

export interface TransactionContextType {
  transactions: TransactionType[];
  setTransaction: React.Dispatch<React.SetStateAction<TransactionType[]>>;
  fetchTransactions: () => Promise<void>;
  isTransactionLoading: boolean;
  setIsTransactionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  accounts: any[];
}
