import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrders({ limit: 100 });
      setOrders(response.data.items || []);
      setTotal(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Order #${id}?`)) {
      return;
    }
    try {
      await orderApi.deleteOrder(id);
      fetchOrders();
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
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Orders ({total})</h4>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found. Create your first order!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Total Amount</th>
                <th>Items</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_id}</td>
                  <td>₹{Number(order.total_amount).toFixed(2)}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
