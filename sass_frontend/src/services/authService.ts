import clientAxios from './axios';
import { AuthResponse, LoginData, RegisterData, ProfileData, User } from '../types/authTypes';



// Interceptor para añadir el token a las solicitudes
clientAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (data: RegisterData): Promise<void> => {
  await clientAxios.post('/register/', data);
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await clientAxios.post<AuthResponse>('/login/', data);
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  const response = await clientAxios.get<User>('/profile/');
  return response.data;
};

export const updateProfile = async (data: ProfileData): Promise<void> => {
  await clientAxios.put('/profile/', data);
};

export const deleteProfile = async (): Promise<void> => {
  await clientAxios.delete('/profile/');
};

export const logout = (): void => {
  localStorage.removeItem('token');
};