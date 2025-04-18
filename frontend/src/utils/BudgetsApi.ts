import { api } from './axios';


export const BudgetsApi = {
    async createNewBudget(userId: number, budget: any) {
        return api.post('/api/budgets/create_budget/', { userId, budget })
    },

    async fetchBudgets(userId: number) {
        return api.get('/api/budgets/fetch_budgets/?userId=' + userId)
    },
}
