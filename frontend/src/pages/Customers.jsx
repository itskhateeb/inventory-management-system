import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { FaUsers, FaPlus } from 'react-icons/fa';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            <FaUsers className="header-icon" />
            Customer Management
          </h2>
          <div className="subtitle">Manage your customer database</div>
        </div>
        <div className="header-actions">
          <Link to="/customers/new" className="btn btn-primary">
            <FaPlus className="me-1" /> Add New Customer
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/new" element={<CustomerForm />} />
      </Routes>
    </div>
  );
};

export default Customers;