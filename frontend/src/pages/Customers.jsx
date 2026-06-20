import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer Management</h2>
        <Link to="/customers/new" className="btn btn-primary">
          Add New Customer
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/new" element={<CustomerForm />} />
      </Routes>
    </div>
  );
};

export default Customers;