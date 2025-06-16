import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllDeliveries, 
  createDelivery, 
  updateDeliveryStatus 
} from '../../services/deliveryApi';
import { 
  DeliveryFormData, 
  StatusUpdateData 
} from '../../types/deliveriesTypes';

export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchAll',
  async (params: { page?: number; status?: string; route_id?: number }, { rejectWithValue }) => {
    try {
      const response = await getAllDeliveries(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching deliveries');
    }
  }
);

export const setFilters  = createAsyncThunk(
  'deliveries/setFilters',
  async (filters: { status?: string; route_id?: number }, { rejectWithValue }) => {
    try {
      const response = await getAllDeliveries(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching deliveries');
    }
  }
);

export const addDelivery = createAsyncThunk(
  'deliveries/create',
  async (deliveryData: DeliveryFormData, { rejectWithValue }) => {
    try {
      const response = await createDelivery(deliveryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || 'Error creating delivery');
    }
  }
);

export const updateDelivery = createAsyncThunk(
  'deliveries/updateStatus',
  async ({ id, statusData }: { id: number; statusData: StatusUpdateData }, { rejectWithValue }) => {
    try {
      const response = await updateDeliveryStatus(id, statusData);
      return { id, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating delivery status');
    }
  }
);