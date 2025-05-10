import { api } from "./axios";



export const BankAccountsApi = {
    async fetchBankAccountsFromDB(accessToken: string) {
        console.log("Calling fetchBankAccountsFromDB with URL:", '/api/bank_accounts/fetch_bank_accounts_from_db/?accessToken=' + accessToken);
        try {
            const response = await api.get('/api/bank_accounts/fetch_bank_accounts_from_db/?accessToken=' + accessToken);
            console.log("fetchBankAccountsFromDB response:", response);
            return { data: response };
        } catch (error) {
            console.error("fetchBankAccountsFromDB error:", error);
            throw error;
        }
    },

    async syncBankAccounts(accessToken: string) {
        console.log("Calling syncBankAccounts with data:", { accessToken });
        try {
            const response = await api.post('/api/bank_accounts/sync_bank_accounts/', { accessToken });
            console.log("syncBankAccounts response:", response);
            return { data: response };
        } catch (error) {
            console.error("syncBankAccounts error:", error);
            throw error;
        }
    }
}