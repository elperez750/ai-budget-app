import { api } from './axios';
import { BudgetType } from '../app/types/BudgetTypes'


export const BudgetsApi = {
    async createNewBudget(userId: number, budget: any) {
        return api.post('/api/budgets/create_budget/', { userId, budget })
    },

    async fetchBudgets(userId: number) {
        return api.get('/api/budgets/fetch_budgets/?userId=' + userId)
    },


    async deleteBudget(budgetId: number) {
        return api.delete('/api/budgets/delete_budget/?budgetId=' + budgetId)
    },

    async updateBudget(budgetId: number, budget: Partial<BudgetType>) {

        return api.put('/api/budgets/update_budget/', { budgetId, budget })
    }


}