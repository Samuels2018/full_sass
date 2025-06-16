import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Delivery, DeliveriesState } from '../../types/deliveriesTypes';

const initialState: DeliveriesState = {
  items: [],
  loading: false,
  error: null,
  success: false,
  currentPage: 1,
  totalPages: 1,
  filters: {},
};

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ status?: string; route_id?: number }>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Se llenará con los thunks
  },
});

export const { setLoading, setError, setSuccess, setFilters, resetState } = deliveriesSlice.actions;
export default deliveriesSlice.reducer;