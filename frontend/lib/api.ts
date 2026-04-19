import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const UPLOADS_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; max-age=0';
      document.cookie = 'role=; path=/; max-age=0';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  checkEmail: (email: string) =>
    api.post('/auth/check-email', { email }),
  resetPassword: (data: { email: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
  createUser: (data: { fullName: string; email: string; password: string; role: string }) =>
    api.post('/auth/create-user', data),
};

export const vacanciesApi = {
  getAll: () => api.get('/vacancies'),
  getById: (id: string, userId?: string) =>
    api.get(`/vacancies/${id}${userId ? `?userId=${userId}` : ''}`),
  getMyVacancies: (userId: string) =>
    api.get(`/vacancies/my/${userId}`),
  create: (data: {
    title: string;
    description: string;
    requirements: string;
    salary: string;
    status: string;
  }) => api.post('/vacancies', data),
  update: (id: string, data: {
    title: string;
    description: string;
    requirements: string;
    salary: string;
    status: string;
  }) => api.put(`/vacancies/${id}`, data),
  delete: (id: string) => api.delete(`/vacancies/${id}`),
};

export const applicationsApi = {
  apply: (formData: FormData) =>
    api.post('/applications/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyApplications: (userId: string) =>
    api.get(`/applications/my/${userId}`),
  getVacancyApplications: (vacancyId: string) =>
    api.get(`/applications/vacancy/${vacancyId}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/applications/${id}/status`, { status }),
};

export const notificationsApi = {
  getAll: (userId: string) =>
    api.get(`/notifications/${userId}`),
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId: string) =>
    api.put(`/notifications/${userId}/read-all`),
};

export const profileApi = {
  get: (userId: string) =>
    api.get(`/profile/${userId}`),
  update: (userId: string, formData: FormData) =>
    api.post(`/profile/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  get: (id: string) =>
    api.get(`/users/${id}`),
  update: (id: string, data: { fullName?: string; password?: string }) =>
    api.put(`/users/${id}`, data),
  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

export default api;
