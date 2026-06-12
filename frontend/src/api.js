import axios from 'axios';

// When running in docker-compose, localhost:8000 maps to the backend container
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export default api;
