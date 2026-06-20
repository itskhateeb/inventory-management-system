import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, customerApi, productApi } from '../services/api';

const OrderForm = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: 1 }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customersRes, productsRes] = await Promise.all([
        customerApi.getCustomers({ limit: 1000 }),
        productApi.getProducts({ limit: 1000 })
      ]);
      setCustomers(customersRes.data.items || []);
      setProducts(productsRes.data.items || []);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = (e) => {
    setFormData({
      ...formData,
      customer_id: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      setError('Order must have at least one item');
      return;
    }
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate customer
    if (!formData.customer_id) {
      setError('Please select a customer');
      return;
    }

    // Validate items
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.product_id) {
        setError(`Please select a product for item ${i + 1}`);
        return;
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        setError(`Quantity must be greater than 0 for item ${i + 1}`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const data = {
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity)
        }))
      };

      await orderApi.createOrder(data);
      setSuccess('Order created successfully!');

      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to create order');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading data...</div>;
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <h4 className="mb-0">Create New Order</h4>
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
          <div className="mb-4">
            <label htmlFor="customer_id" className="form-label">Customer *</label>
            <select
              className="form-select"
              id="customer_id"
              value={formData.customer_id}
              onChange={handleCustomerChange}
              required
            >
              <option value="">Select a customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          <h5 className="mb-3">Order Items</h5>
          {formData.items.map((item, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-5">
                    <label className="form-label">Product *</label>
                    <select
                      className="form-select"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      required
                    >
                      <option value="">Select product...</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - SKU: {product.sku} (Stock: {product.stock_quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary mb-3"
            onClick={addItem}
          >
            Add Another Item
          </button>

          <div className="d-flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Order'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/orders')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;