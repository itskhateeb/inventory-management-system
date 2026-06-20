import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../services/api';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock_quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProduct(id);
      const product = response.data;
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock_quantity: product.stock_quantity
      });
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.sku.trim()) {
      setError('SKU is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      setError('Stock quantity must be 0 or greater');
      return;
    }

    try {
      setLoading(true);
      const data = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      if (isEdit) {
        await productApi.updateProduct(id, data);
        setSuccess('Product updated successfully!');
      } else {
        await productApi.createProduct(data);
        setSuccess('Product created successfully!');
        setFormData({ name: '', sku: '', price: '', stock_quantity: '' });
      }

      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to save product');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="text-center py-4">Loading product...</div>;
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">{isEdit ? 'Edit Product' : 'Add New Product'}</h4>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="sku" className="form-label">SKU *</label>
            <input
              type="text"
              className="form-control"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter unique SKU"
              required
              disabled={isEdit}
            />
            {isEdit && (
              <small className="text-muted">SKU cannot be changed after creation</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price *</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="stock_quantity" className="form-label">Stock Quantity *</label>
            <input
              type="number"
              className="form-control"
              id="stock_quantity"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="0"
              step="1"
              min="0"
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;