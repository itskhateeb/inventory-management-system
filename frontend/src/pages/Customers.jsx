import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { FaUsers, FaPlus, FaUserFriends } from 'react-icons/fa';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
  return (
    <div>
      <div className="page-header creative-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <FaUserFriends className="header-main-icon" />
          </div>
          <div>
            <h2 className="creative-title">
              <span className="title-highlight">Customer</span> Management
            </h2>
            <p className="header-description">
              <FaUsers className="inline-icon" /> Manage your customer database, track interactions, and build relationships
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/customers/new" className="btn btn-primary btn-creative">
            <FaPlus className="me-2" /> Add New Customer
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