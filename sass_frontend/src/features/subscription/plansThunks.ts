// features/plans/plansThunks.ts
import { AppDispatch } from '../store';
import { setLoading, setError, setPlans } from './plansSlice';
import plansApi from '../../services/plansApi';

export const fetchPlans = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const plans = await plansApi.getPlans(userId);
    dispatch(setPlans(plans));
    dispatch(setError(null));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch plans';
    dispatch(setError(errorMessage || 'Failed to fetch plans'));
  } finally {
    dispatch(setLoading(false));
  }
};