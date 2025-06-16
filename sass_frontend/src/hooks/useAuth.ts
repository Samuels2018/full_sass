import { useState, useEffect } from 'react';
import { login, register, logout as apiLogout, getProfile, updateProfile, deleteProfile } from '../services/authService';
import { AuthResponse, LoginData, RegisterData, ProfileData, User } from '../types/authTypes';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getProfile();
          setUser(userData);
        } catch (err) {
          console.error('Error loading user', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signIn = async (data: LoginData) => {
    try {
      setError(null);
      const { access_token, expires_at } = await login(data);
      localStorage.setItem('token', access_token);
      const userData = await getProfile();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during login');
      throw err;
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      setError(null);
      await register(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during registration');
      throw err;
    }
  };

  const updateUserProfile = async (data: ProfileData) => {
    try {
      setError(null);
      await updateProfile(data);
      const userData = await getProfile();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile');
      throw err;
    }
  };

  const deleteUser = async () => {
    try {
      await deleteProfile();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting profile');
      throw err;
    }
  };

  const signOut = () => {
    apiLogout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    deleteUser,
  };
};