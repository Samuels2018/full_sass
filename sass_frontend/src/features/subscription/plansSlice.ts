// features/plans/plansSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Plan, PlansState } from '../../types/suscriptionsTypes';

const initialState: PlansState = {
  plans: [],
  loading: false,
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
    },
    clearPlans: (state) => {
      state.plans = [];
    },
  },
});

export const { setLoading, setError, setPlans, clearPlans } = plansSlice.actions;
export default plansSlice.reducer;