import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

const openLibrary = axios.create({ baseURL: 'https://openlibrary.org' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (userData) => api.post('/signup', userData);
export const login = (credentials) => api.post('/login', credentials);
export const getCurrentUser = () => api.get('/me');

export const getCollections = () => api.get('/collections');
export const getCollection = (id) => api.get(`/collections/${id}`);
export const getCollectionBooks = (id) => api.get(`/collections/${id}/books`);
export const createCollection = (data) => api.post('/collections', data);
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data);
export const deleteCollection = (id) => api.delete(`/collections/${id}`);

export const getSavedBooks = () => api.get('/saved_books');
export const addSavedBook = (data) => api.post('/saved_books', data);
export const updateSavedBook = (id, data) => api.put(`/saved_books/${id}`, data);
export const deleteSavedBook = (id) => api.delete(`/saved_books/${id}`);
export const updateReadingProgress = (id, data) => api.put(`/saved_books/${id}/update-progress`, data);
export const getBookSessions = (id) => api.get(`/saved_books/${id}/sessions`);
export const logReadingSession = (id, data) => api.post(`/saved_books/${id}/sessions`, data);
export const getBookQuotes = (id) => api.get(`/saved_books/${id}/quotes`);
export const addQuote = (id, data) => api.post(`/saved_books/${id}/quotes`, data);
export const getUserStats = () => api.get('/users/me/stats');
export const getReadingGoal = () => api.get('/users/me/goals');
export const setReadingGoal = (data) => api.post('/users/me/goals', data);

export const searchBooks = (query, options = {}) => openLibrary.get('/search.json', {
  params: { q: query, limit: 30, fields: 'key,title,author_name,cover_i,first_publish_year,edition_count,number_of_pages_median,subject', ...options },
});
export const getSubjectBooks = (subject, limit = 12) => openLibrary.get(`/subjects/${subject}.json`, { params: { limit } });
export const getWork = (workKey) => openLibrary.get(`${workKey}.json`);
export const getAuthor = (authorKey) => openLibrary.get(`${authorKey}.json`);
export const getEditions = (workKey, limit = 20) => openLibrary.get(`${workKey}/editions.json`, { params: { limit } });

export default api;
