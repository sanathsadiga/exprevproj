import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || `http://localhost:5001`;

const api = axios.create({
  baseURL: baseURL,
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
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const locationAPI = {
  getLocations: () => api.get('/api/locations'),
  createLocation: (data) => api.post('/api/locations/create', data),
  deleteLocation: (id) => api.delete(`/api/locations/${id}`),
};

export const dataAPI = {
  addExpenseRevenue: (data) => api.post('/api/data/add', data),
  updateExpenseRevenue: (id, data) => api.put(`/api/data/${id}`, data),
  deleteExpenseRevenue: (id) => api.delete(`/api/data/${id}`),
  bulkImportCSV: (data) => api.post('/api/data/bulk-import', data),
  getMonthlyData: (params) => api.get('/api/data/monthly', { params }),
  getYearlyData: (params) => api.get('/api/data/yearly', { params }),
  getAllMonthlyData: (params) => api.get('/api/data/all-monthly', { params }),
  getAllYearlyData: (params) => api.get('/api/data/all-yearly', { params }),
  getDashboardSummary: (params) => api.get('/api/data/summary', { params }),
};

export default api;
