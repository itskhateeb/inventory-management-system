import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { FaBox, FaPlus, FaStore } from 'react-icons/fa';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const Products = () => {
  return (
    <div>
      <div className="page-header creative-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <FaStore className="header-main-icon" />
          </div>
          <div>
            <h2 className="creative-title">
              <span className="title-highlight">Product</span> Management
            </h2>
            <p className="header-description">
              <FaBox className="inline-icon" /> Manage your product inventory, track stock levels, and update product details
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/products/new" className="btn btn-primary btn-creative">
            <FaPlus className="me-2" /> Add New Product
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/new" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductForm />} />
      </Routes>
    </div>
  );
};

export default Products;