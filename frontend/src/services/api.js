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
  // Get all products with pagination and filters
  getProducts: (params = {}) => {
    const { skip = 0, limit = 100, search = '', minPrice, maxPrice } = params;
    let url = `/products?skip=${skip}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (minPrice) url += `&min_price=${minPrice}`;
    if (maxPrice) url += `&max_price=${maxPrice}`;
    return api.get(url);
  },

  // Get product by ID
  getProduct: (id) => api.get(`/products/${id}`),

  // Create product
  createProduct: (data) => api.post('/products', data),

  // Update product
  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Get low stock products
  getLowStock: (threshold = 10) => api.get(`/products/low-stock/?threshold=${threshold}`),
};

export default api;