import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API URL =', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const productApi = {
  getProducts: (params = {}) => {
    const { skip = 0, limit = 100, search = '', minPrice, maxPrice } = params;

    let url = `/products/?skip=${skip}&limit=${limit}`;

    if (search) url += `&search=${search}`;
    if (minPrice !== undefined) url += `&min_price=${minPrice}`;
    if (maxPrice !== undefined) url += `&max_price=${maxPrice}`;

    return api.get(url);
  },

  getProduct: (id) => api.get(`/products/${id}`),

  createProduct: (data) => api.post('/products/', data),

  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  getLowStock: (threshold = 10) =>
    api.get(`/products/low-stock/?threshold=${threshold}`),
};

// Customer API
export const customerApi = {
  getCustomers: (params = {}) => {
    const { skip = 0, limit = 100, search = '' } = params;

    let url = `/customers/?skip=${skip}&limit=${limit}`;

    if (search) url += `&search=${search}`;

    return api.get(url);
  },

  getCustomer: (id) => api.get(`/customers/${id}`),

  createCustomer: (data) => api.post('/customers/', data),

  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),

  deleteCustomer: (id) => api.delete(`/customers/${id}`),
};

// Order API
export const orderApi = {
  getOrders: (params = {}) => {
    const { skip = 0, limit = 100, customer_id } = params;

    let url = `/orders/?skip=${skip}&limit=${limit}`;

    if (customer_id) url += `&customer_id=${customer_id}`;

    return api.get(url);
  },

  getOrder: (id) => api.get(`/orders/${id}`),

  createOrder: (data) => api.post('/orders/', data),

  deleteOrder: (id) => api.delete(`/orders/${id}`),

  getCustomerOrders: (customerId, params = {}) => {
    const { skip = 0, limit = 100 } = params;

    return api.get(
      `/orders/customer/${customerId}/?skip=${skip}&limit=${limit}`
    );
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: (params = {}) => {
    const {
      low_stock_threshold = 10,
      recent_orders_limit = 5,
    } = params;

    return api.get(
      `/dashboard/stats?low_stock_threshold=${low_stock_threshold}&recent_orders_limit=${recent_orders_limit}`
    );
  },

  getLowStock: (threshold = 10) =>
    api.get(`/dashboard/low-stock?threshold=${threshold}`),

  getRecentOrders: (limit = 5) =>
    api.get(`/dashboard/recent-orders?limit=${limit}`),
};

export default api;