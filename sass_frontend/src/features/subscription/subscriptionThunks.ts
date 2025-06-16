import { AppDispatch } from '../store';
import { setLoading, setError, setSubscription } from './subscriptionSlice';
import subscriptionApi from '../../services/subscriptionApi';

export const getActiveSubscription = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const subscription = await subscriptionApi.getActiveSubscription(userId);
    dispatch(setSubscription(subscription));
    dispatch(setError(null));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscription';
    dispatch(setError(errorMessage || 'Failed to fetch subscription'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const subscribeToPlan = (
  userId: string,
  planId: string,
  planData?: any
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const subscription = await subscriptionApi.subscribeToPlan(userId, planId, planData);
    dispatch(setSubscription(subscription));
    dispatch(setError(null));
    return subscription;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscription';
    dispatch(setError(errorMessage || 'Failed to subscribe'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const changeSubscription = (
  userId: string,
  planId: string,
  status?: string,
  startDate?: string,
  endDate?: string | null,
  nextBillingDate?: string
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const subscription = await subscriptionApi.changeSubscription(
      userId,
      planId,
      status,
      startDate,
      endDate,
      nextBillingDate
    );
    dispatch(setSubscription(subscription));
    dispatch(setError(null));
    return subscription;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscription';
    dispatch(setError(errorMessage || 'Failed to change subscription'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};