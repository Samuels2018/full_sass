import apiClient from './apiClient';
import { DeliveryFormData, StatusUpdateData } from '../types/deliveriesTypes';

export const getAllDeliveries = (params: {
  page?: number;
  status?: string;
  route_id?: number;
}) => {
  return apiClient.get('/deliveries', { params });
};

export const createDelivery = (deliveryData: DeliveryFormData) => {
  return apiClient.post('/deliveries/register', deliveryData);
};

export const updateDeliveryStatus = (id: number, statusData: StatusUpdateData) => {
  return apiClient.put(`/deliveries/update/${id}`, statusData);
};