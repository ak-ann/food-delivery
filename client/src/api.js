import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchOrders = (config = {}) =>
  api.get('/orders', config);


export const addOrder = (order) =>
  api.post('/orders', order);


export const updateOrder = (id, order) =>
  api.put(`/orders/${id}`, order);


export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`);


export const loginUser = (data) =>
  api.post('/auth/login', data);


export const registerUser = (data) =>
  api.post('/auth/register', data);


export const fetchProfile = () =>
  api.get('/auth/profile');