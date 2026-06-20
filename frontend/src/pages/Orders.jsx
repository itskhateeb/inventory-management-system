import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { FaShoppingCart, FaPlus, FaClipboardList } from 'react-icons/fa';
import OrderList from '../components/OrderList';
import OrderForm from '../components/OrderForm';
import OrderDetail from '../components/OrderDetail';

const Orders = () => {
  return (
    <div>
      <div className="page-header creative-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <FaClipboardList className="header-main-icon" />
          </div>
          <div>
            <h2 className="creative-title">
              <span className="title-highlight">Order</span> Management
            </h2>
            <p className="header-description">
              <FaShoppingCart className="inline-icon" /> Track and manage customer orders, monitor order status, and process payments
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/orders/new" className="btn btn-success btn-creative">
            <FaPlus className="me-2" /> Create New Order
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