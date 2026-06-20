import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { FaShoppingCart, FaPlus } from 'react-icons/fa';
import OrderList from '../components/OrderList';
import OrderForm from '../components/OrderForm';
import OrderDetail from '../components/OrderDetail';

const Orders = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            <FaShoppingCart className="header-icon" />
            Order Management
          </h2>
          <div className="subtitle">Track and manage customer orders</div>
        </div>
        <div className="header-actions">
          <Link to="/orders/new" className="btn btn-success">
            <FaPlus className="me-1" /> Create New Order
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/new" element={<OrderForm />} />
        <Route path="/:id" element={<OrderDetail />} />
      </Routes>
    </div>
  );
};

export default Orders;