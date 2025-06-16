import axios from 'axios';


const API_URL = 'http://localhost:8000/api'; // Ajusta según tu configuración

const clientAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default clientAxios;