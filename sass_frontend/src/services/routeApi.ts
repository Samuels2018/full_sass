import apiClient from './apiClient';
import { RouteData } from '../types/routesTypes';

export const createRoute = (routeData: RouteData) => {
  return apiClient.post('/routes/create', routeData);
};