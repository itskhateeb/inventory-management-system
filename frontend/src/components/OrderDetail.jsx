import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrder(id);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      setError('Order not found');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete Order #${id}?`)) {
      return;
    }
    try {
      await orderApi.deleteOrder(id);
      navigate('/orders');
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Order not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Order #{order.id}</h4>
        <div>
          <button
            className="btn btn-outline-danger me-2"
            onClick={handleDelete}
          >
            Delete Order
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Customer ID:</strong> {order.customer_id}</p>
              <p><strong>Total Amount:</strong> ₹{Number(order.total_amount).toFixed(2)}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
              {order.customer && (
                <>
                  <p><strong>Customer:</strong> {order.customer.full_name}</p>
                  <p><strong>Email:</strong> {order.customer.email}</p>
                  <p><strong>Phone:</strong> {order.customer.phone || 'N/A'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <h5>Order Items</h5>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Price at Purchase</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product_id}</td>
                <td>{item.quantity}</td>
                <td>₹{Number(item.price_at_purchase).toFixed(2)}</td>
                <td>₹{(Number(item.price_at_purchase) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-end"><strong>Total:</strong></td>
              <td><strong>₹{Number(order.total_amount).toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;