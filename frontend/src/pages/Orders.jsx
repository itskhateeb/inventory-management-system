import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import OrderList from '../components/OrderList';
import OrderForm from '../components/OrderForm';
import OrderDetail from '../components/OrderDetail';

const Orders = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Management</h2>
        <Link to="/orders/new" className="btn btn-success">
          Create New Order
        </Link>
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