import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://your-api-url.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('external_auth_token')}`,
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;