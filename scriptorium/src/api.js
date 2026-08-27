import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5555/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const signup = (userData) => api.post('/signup', userData);
export const login = (credentials) => api.post('/login', credentials);
export const getCurrentUser = () => api.get('/me');

// Collections endpoints
export const getCollections = () => api.get('/collections');
export const createCollection = (data) => api.post('/collections', data);
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data);
export const deleteCollection = (id) => api.delete(`/collections/${id}`);

// Saved Books endpoints
export const getSavedBooks = () => api.get('/saved_books');
export const addSavedBook = (data) => api.post('/saved_books', data);
export const updateSavedBook = (id, data) => api.put(`/saved_books/${id}`, data);
export const deleteSavedBook = (id) => api.delete(`/saved_books/${id}`);

export default api;