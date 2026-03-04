import axios from 'axios';

const baseURL = `http://76.13.19.45:5006/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const locationAPI = {
  getLocations: () => api.get('/locations'),
  createLocation: (data) => api.post('/locations/create', data),
  deleteLocation: (id) => api.delete(`/locations/${id}`),
};

export const dataAPI = {
  addExpenseRevenue: (data) => api.post('/data/add', data),
  updateExpenseRevenue: (id, data) => api.put(`/data/${id}`, data),
  deleteExpenseRevenue: (id) => api.delete(`/data/${id}`),
  bulkImportCSV: (data) => api.post('/data/bulk-import', data),
  getMonthlyData: (params) => api.get('/data/monthly', { params }),
  getYearlyData: (params) => api.get('/data/yearly', { params }),
  getAllMonthlyData: (params) => api.get('/data/all-monthly', { params }),
  getAllYearlyData: (params) => api.get('/data/all-yearly', { params }),
  getDashboardSummary: () => api.get('/data/summary'),
};

export default api;
