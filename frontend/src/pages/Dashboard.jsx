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
        <p className="mt-3 text-muted">Loading dashboard...</p>
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

  const StatCard = ({ title, value, icon, color, link, subtitle }) => (
    <div className="col-md-3 col-sm-6 mb-3">
      <div className={`card bg-${color} text-white h-100 shadow-sm stat-card`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="card-title text-uppercase opacity-75 mb-1">{title}</h6>
              <h2 className="mb-0 display-5 fw-bold">{value}</h2>
              {subtitle && <small className="opacity-75">{subtitle}</small>}
            </div>
            <div className="display-4 opacity-50">{icon}</div>
          </div>
          {link && (
            <div className="mt-3">
              <Link to={link} className="text-white text-decoration-none opacity-75 hover-opacity-100">
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
      {/* Welcome Section */}
      <div className="mb-4 fade-in">
        <div className="p-4 bg-light rounded-3 shadow-sm border-start border-primary border-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="display-6 fw-bold mb-0">📊 Dashboard</h1>
              <p className="text-muted mb-0">Manage your products, customers, and orders efficiently.</p>
            </div>
            <div className="mt-2 mt-sm-0">
              <span className="badge bg-primary rounded-pill py-2 px-3">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="row">
        <StatCard 
          title="Total Products" 
          value={stats.total_products} 
          icon="📦" 
          color="primary"
          link="/products"
          subtitle={`${stats.total_products} items in inventory`}
        />
        <StatCard 
          title="Total Customers" 
          value={stats.total_customers} 
          icon="👥" 
          color="success"
          link="/customers"
          subtitle={`${stats.total_customers} registered customers`}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.total_orders} 
          icon="📋" 
          color="info"
          link="/orders"
          subtitle={`${stats.total_orders} orders placed`}
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.low_stock_count} 
          icon="⚠️" 
          color={stats.low_stock_count > 0 ? "warning" : "secondary"}
          link="/products"
          subtitle={stats.low_stock_count > 0 ? "Needs attention!" : "All stocked up!"}
        />
      </div>

      {/* Low Stock and Recent Orders Section */}
      <div className="row mt-4">
        {/* Low Stock Products */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning d-flex justify-content-between align-items-center">
              <h5 className="mb-0">⚠️ Low Stock Products</h5>
              {lowStockProducts.length > 0 && (
                <span className="badge bg-danger rounded-pill">{lowStockProducts.length}</span>
              )}
            </div>
            <div className="card-body">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-success mb-0">✅ All products have sufficient stock</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.slice(0, 5).map((product) => (
                        <tr key={product.id}>
                          <td className="fw-semibold">{product.name}</td>
                          <td><code>{product.sku}</code></td>
                          <td>
                            <span className={`badge ${product.stock_quantity === 0 ? 'bg-danger' : 'bg-warning'}`}>
                              {product.stock_quantity}
                            </span>
                          </td>
                          <td>
                            <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-outline-primary">
                              Update
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {lowStockProducts.length > 5 && (
                <div className="mt-3 text-center">
                  <Link to="/products" className="btn btn-sm btn-outline-primary">
                    View all {lowStockProducts.length} low stock products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Recent Orders</h5>
              {recentOrders.length > 0 && (
                <span className="badge bg-light text-dark rounded-pill">{recentOrders.length}</span>
              )}
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No recent orders</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-semibold">#{order.id}</td>
                          <td>Customer #{order.customer_id}</td>
                          <td className="fw-bold">${Number(order.total_amount).toFixed(2)}</td>
                          <td>
                            <span className="badge bg-success">Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {recentOrders.length > 0 && (
                <div className="mt-3 text-center">
                  <Link to="/orders" className="btn btn-sm btn-outline-primary">
                    View all orders
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;