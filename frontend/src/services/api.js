import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const trimmed = envUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  getFamily: () => api.get('/users/family'),
  inviteFamily: (member) => api.post('/users/family', member),
  revokeFamily: (id) => api.delete(`/users/family/${id}`)
};

export const accountApi = {
  getAccounts: () => api.get('/accounts'),
  linkAccount: (accountData) => api.post('/accounts/link', accountData),
  unlinkAccount: (id) => api.delete(`/accounts/${id}`),
  syncAccount: (id) => api.post(`/accounts/${id}/sync`)
};

export const transactionApi = {
  getTransactions: (params) => api.get('/transactions', { params }),
  createTransaction: (txnData) => api.post('/transactions', txnData),
  syncTransactions: () => api.post('/transactions/sync')
};

export const budgetApi = {
  getSummary: () => api.get('/budgets/summary'),
  getAll: () => api.get('/budgets'),
  saveBudget: (budgetData) => api.post('/budgets', budgetData)
};

export const goalApi = {
  getGoals: () => api.get('/goals'),
  createGoal: (goalData) => api.post('/goals', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData)
};

export const billApi = {
  getUpcoming: () => api.get('/bills/upcoming'),
  getAll: () => api.get('/bills'),
  addBill: (billData) => api.post('/bills', billData),
  payBill: (id) => api.post(`/bills/${id}/pay`)
};

export const investmentApi = {
  getInvestments: () => api.get('/investments'),
  getAllocation: () => api.get('/investments/allocation'),
  addInvestment: (invData) => api.post('/investments', invData)
};

export const netWorthApi = {
  getSummary: () => api.get('/networth')
};

export const taxApi = {
  getSummary: () => api.get('/tax/summary')
};

export const analyticsApi = {
  getInsights: () => api.get('/analytics/insights'),
  chat: (query) => api.post('/analytics/chat', { query })
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`)
};

export default api;
