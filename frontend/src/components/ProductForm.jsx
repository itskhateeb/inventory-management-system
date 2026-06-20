import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      toast.error('Failed to load product');
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

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.sku.trim()) {
      toast.error('SKU is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      toast.error('Stock quantity must be 0 or greater');
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
        toast.success('Product updated successfully!');
      } else {
        await productApi.createProduct(data);
        toast.success('Product created successfully!');
        setFormData({ name: '', sku: '', price: '', stock_quantity: '' });
      }

      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to save product';
      toast.error(message);
      setError(message);
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
        <h4 className="mb-0">{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h4>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">Product Name *</label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="sku" className="form-label fw-bold">SKU *</label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter unique SKU"
              required
              disabled={isEdit}
            />
            {isEdit && (
              <small className="text-muted">🔒 SKU cannot be changed after creation</small>
            )}
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="price" className="form-label fw-bold">Price *</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control form-control-lg"
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
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="stock_quantity" className="form-label fw-bold">Stock Quantity *</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
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
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-4"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg px-4"
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