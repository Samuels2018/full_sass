import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionWithPlan, BillingInfo, SubscriptionState } from '../../types/suscriptionsTypes';

const initialState: SubscriptionState = {
  currentSubscription: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSubscription: (state, action: PayloadAction<SubscriptionWithPlan | null>) => {
      state.currentSubscription = action.payload;
    },
    clearSubscription: (state) => {
      state.currentSubscription = null;
    },
  },
});

export const { setLoading, setError, setSubscription, clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;