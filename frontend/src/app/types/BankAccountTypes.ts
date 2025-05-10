export interface BankAccountContextType {
    bankAccounts: BankAccountType[];
    setBankAccounts: React.Dispatch<React.SetStateAction<BankAccountType[]>>;
    fetchBankAccounts: () => Promise<void>;
    isBankAccountLoading: boolean;
    setIsBankAccountLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


export interface BankAccountType {
    accessToken: string;
    accountId: string;
    accountName: string;
    currentBalance: number;
    availableBalance: number;
    currency: string;
}