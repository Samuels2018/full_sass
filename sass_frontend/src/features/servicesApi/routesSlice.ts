import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RouteData } from '../../types/routesTypes';
import { createRoute } from '../../services/routeApi';

interface RoutesState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RoutesState = {
  loading: false,
  error: null,
  success: false,
};

export const createNewRoute = createAsyncThunk(
  'routes/create',
  async (routeData: RouteData, { rejectWithValue }) => {
    try {
      const response = await createRoute(routeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating route');
    }
  }
);

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    resetRouteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewRoute.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createNewRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetRouteState } = routesSlice.actions;
export default routesSlice.reducer;