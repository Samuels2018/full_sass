// api/plansApi.ts
import apiClient from './apiClient';
import { Plan } from '../types/suscriptionsTypes';

const plansApi = {
  async getPlans(userId: string): Promise<Plan[]> {
    const response = await apiClient.post('/plans/plans', { userId });
    return response.data;
  },
};

export default plansApi;