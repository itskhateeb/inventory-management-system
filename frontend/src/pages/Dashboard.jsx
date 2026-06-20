import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    low_stock_count: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats({
        low_stock_threshold: 10,
        recent_orders_limit: 5
      });
      
      const data = response.data;
      setStats({
        total_products: data.stats.total_products || 0,
        total_customers: data.stats.total_customers || 0,
        total_orders: data.stats.total_orders || 0,
        low_stock_count: data.low_stock_count || 0
      });
      setLowStockProducts(data.stats.low_stock_products || []);
      setRecentOrders(data.recent_orders || []);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
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

  const StatCard = ({ title, value, icon, color, link }) => (
    <div className="col-md-3 col-sm-6 mb-3">
      <div className={`card text-white bg-${color} h-100`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="card-title text-uppercase">{title}</h6>
              <h2 className="mb-0">{value}</h2>
            </div>
            <div className="display-4 opacity-50">{icon}</div>
          </div>
          {link && (
            <div className="mt-2">
              <Link to={link} className="text-white text-decoration-none">
                View Details →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <div className="row">
        <StatCard 
          title="Total Products" 
          value={stats.total_products} 
          icon="📦" 
          color="primary"
          link="/products"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.total_customers} 
          icon="👥" 
          color="success"
          link="/customers"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.total_orders} 
          icon="📋" 
          color="info"
          link="/orders"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.low_stock_count} 
          icon="⚠️" 
          color="warning"
          link="/products"
        />
      </div>

      <div className="row mt-4">
        {/* Low Stock Products */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-warning">
              <h5 className="mb-0">⚠️ Low Stock Products</h5>
            </div>
            <div className="card-body">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted">No low stock products</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.slice(0, 5).map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.sku}</td>
                          <td>
                            <span className="badge bg-danger">{product.stock_quantity}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {lowStockProducts.length > 5 && (
                <Link to="/products" className="btn btn-sm btn-outline-primary mt-2">
                  View all low stock products
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">📋 Recent Orders</h5>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <p className="text-muted">No recent orders</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>Customer #{order.customer_id}</td>
                          <td>${Number(order.total_amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {recentOrders.length > 0 && (
                <Link to="/orders" className="btn btn-sm btn-outline-primary mt-2">
                  View all orders
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;