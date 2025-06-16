import apiClient from './apiClient';
import { SubscriptionWithPlan, Plan } from '../types/suscriptionsTypes';

const subscriptionApi = {
  async getActiveSubscription(userId: string): Promise<SubscriptionWithPlan> {
    const response = await apiClient.post('/subscriptions/subscription', { userId });
    return response.data.subscription;
  },

  async subscribeToPlan(userId: string, planId: string, planData?: any): Promise<SubscriptionWithPlan> {
    const response = await apiClient.post('/subscriptions/subscribe', {
      userId,
      planId,
      planData,
    });
    return response.data.suscription;
  },

  async changeSubscription(
    userId: string,
    planId: string,
    status?: string,
    startDate?: string,
    endDate?: string | null,
    nextBillingDate?: string
  ): Promise<SubscriptionWithPlan> {
    const response = await apiClient.put('/subscriptions/subscription', {
      userId,
      planId,
      status,
      startDate,
      endDate,
      nextBillingDate,
    });
    return response.data.subscription;
  },

  // Métodos adicionales para obtener planes disponibles
  async getAvailablePlans(): Promise<Plan[]> {
    const response = await apiClient.get('/plans'); // Ajusta según tu endpoint
    return response.data;
  },
};

export default subscriptionApi;