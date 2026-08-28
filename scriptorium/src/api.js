import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
export const createCollection = (data) =>
  api.post('/collections', data);
export const updateCollection = (id, data) =>
  api.put(`/collections/${id}`, data);
export const deleteCollection = (id) =>
  api.delete(`/collections/${id}`);

// Saved Books endpoints
export const getSavedBooks = () => api.get('/saved_books');
export const addSavedBook = (data) =>
  api.post('/saved_books', data);
export const updateSavedBook = (id, data) =>
  api.put(`/saved_books/${id}`, data);
export const deleteSavedBook = (id) =>
  api.delete(`/saved_books/${id}`);

// Reading Progress & Sessions
export const updateReadingProgress = (id, data) =>
  api.put(`/saved_books/${id}/update-progress`, data);

export const getBookSessions = (id) =>
  api.get(`/saved_books/${id}/sessions`);

export const logReadingSession = (id, data) =>
  api.post(`/saved_books/${id}/sessions`, data);

// Quotes
export const getBookQuotes = (id) =>
  api.get(`/saved_books/${id}/quotes`);

export const addQuote = (id, data) =>
  api.post(`/saved_books/${id}/quotes`, data);

// Statistics & Goals
export const getUserStats = () =>
  api.get('/users/me/stats');

export const getReadingGoal = () =>
  api.get('/users/me/goals');

export const setReadingGoal = (data) =>
  api.post('/users/me/goals', data);

export default api;
