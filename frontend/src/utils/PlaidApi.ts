import { api } from './axios';

export const PlaidApi = {
    async createLinkToken(userId: number) {
        return api.post<{ linkToken: string }>('/api/plaid_integration/create_link_token/', { userId })
    },

    async exchangePublicToken(publicToken: string) {
        return api.post<{ access_token: string }>('/api/plaid_integration/exchange_public_token/', { publicToken })
    },

    async syncTransactions(accessToken: string, cursor?: string) {
        return api.post('/api/transactions/sync_transactions/', {accessToken, cursor})
    },

    /**
     * Simulates new transactions for demo purposes
     * (Useful for creating fresh transactions in the current month)
     */
    async simulateTransactions(accessToken: string) {
        return api.post('/api/transactions/simulate_transactions/', { accessToken })
    },

    /**
     * Generates mock transactions for the current month if no real transactions exist
     * This helps ensure the dashboard always has data to display
     */
    async ensureCurrentMonthTransactions(accessToken: string) {
        // First check if we have transactions for the current month
        const result = await this.fetchTransactionsFromDB(accessToken);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Filter to see if we have transactions for the current month
        const hasCurrentMonthTransactions = result?.transactions?.some(transaction => {
            const transDate = new Date(transaction.date);
            return transDate.getMonth() === currentMonth &&
                   transDate.getFullYear() === currentYear;
        });

        // If no current month transactions, simulate some
        if (!hasCurrentMonthTransactions) {
            return this.simulateTransactions(accessToken);
        }

        return result;
    },

    async hasAccessToken() {
        // This method can be used to validate if the access token is still valid
        return api.get('/api/plaid_integration/has_token/')
    },

    async fetchTransactionsFromDB(accessToken: string) {
        return api.get<{ transactions: { date: string }[] }>('/api/transactions/fetch_transactions_from_db/?accessToken=' + accessToken)
    }
}