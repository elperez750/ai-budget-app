import { api } from './axios';

export const PlaidApi = {
    async createLinkToken(userId: number) {
        return api.post<{ linkToken: string }>('/api/finance/create_link_token/', { userId })
    },

    async exchangePublicToken(publicToken: string) {
        return api.post<{ access_token: string }>('/api/finance/exchange_public_token/', { publicToken })
    },

    async syncTransactions(accessToken: string, cursor?: string) {
        return api.post('/api/finance/sync_transactions/', {accessToken, cursor})
    },


    async simulateTransactions(accessToken: string) {
        return api.post('/api/finance/simulate_transactions/', { accessToken })
    },

    async hasAccessToken() {
        // This method can be used to validate if the access token is still valid
        return api.get('/api/finance/has_token/')
    },

    async fetchTransactionsFromDB(accessToken: string) {
        return api.get('/api/finance/fetch_transactions_from_db/?accessToken=' + accessToken)
    }
}