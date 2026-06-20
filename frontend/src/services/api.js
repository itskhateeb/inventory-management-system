import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API calls
export const productApi = {
  getProducts: (params = {}) => {
    const { skip = 0, limit = 100, search = '', minPrice, maxPrice } = params;
    let url = `/products?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;
    return api.get(url);
  },
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getLowStock: (threshold = 10) => api.get(`/products/low-stock/?threshold=${threshold}`),
};

// Customer API calls
export const customerApi = {
  getCustomers: (params = {}) => {
    const { skip = 0, limit = 100, search = '' } = params;
    let url = `/customers?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

export default api;