import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log("API URL =", import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API calls
export const productApi = {
  // Get all products with pagination and filters
  getProducts: (params = {}) => {
    const { skip = 0, limit = 100, search = '', minPrice, maxPrice } = params;
    let url = `/products/?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;
    return api.get(url);
  },

  // Get product by ID
  getProduct: (id) => api.get(`/products/${id}`),

  // Create product
  createProduct: (data) => api.post('/products/', data),

  // Update product
  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Get low stock products
  getLowStock: (threshold = 10) => api.get(`/products/low-stock/?threshold=${threshold}`),
};

// Customer API calls
export const customerApi = {
  // Get all customers with pagination and search
  getCustomers: (params = {}) => {
    const { skip = 0, limit = 100, search = '' } = params;
    let url = `/customers/?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },

  // Get customer by ID
  getCustomer: (id) => api.get(`/customers/${id}`),

  // Create customer
    createCustomer: (data) => api.post('/customers/', data),

// Update customer
    updateCustomer: (id, data) => api.put(`/customers/${id}/`, data),

// Delete customer
    deleteCustomer: (id) => api.delete(`/customers/${id}/`),
}

// Order API calls
export const orderApi = {
  // Get all orders with pagination
  getOrders: (params = {}) => {
    const { skip = 0, limit = 100, customer_id } = params;
    let url = `/orders/?skip=${skip}&limit=${limit}`;
    if (customer_id) url += `&customer_id=${customer_id}`;
    return api.get(url);
  },

  // Get order by ID
  getOrder: (id) => api.get(`/orders/${id}`),

  // Create order
  createOrder: (data) => api.post('/orders', data),

  // Delete order
  deleteOrder: (id) => api.delete(`/orders/${id}`),

  // Get orders by customer
  getCustomerOrders: (customerId, params = {}) => {
    const { skip = 0, limit = 100 } = params;
    return api.get(`/orders/customer/${customerId}/?skip=${skip}&limit=${limit}`);
  },
};

// Dashboard API calls
export const dashboardApi = {
  // Get dashboard statistics
  getStats: (params = {}) => {
    const { low_stock_threshold = 10, recent_orders_limit = 5 } = params;
    return api.get(`/dashboard/stats?low_stock_threshold=${low_stock_threshold}&recent_orders_limit=${recent_orders_limit}`);
  },

  // Get low stock products
  getLowStock: (threshold = 10) => api.get(`/dashboard/low-stock?threshold=${threshold}`),

  // Get recent orders
  getRecentOrders: (limit = 5) => api.get(`/dashboard/recent-orders?limit=${limit}`),
};

export default api;