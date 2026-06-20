import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { FaBox, FaPlus } from 'react-icons/fa';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const Products = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>
            <FaBox className="header-icon" />
            Product Management
          </h2>
          <div className="subtitle">Manage your product inventory</div>
        </div>
        <div className="header-actions">
          <Link to="/products/new" className="btn btn-primary">
            <FaPlus className="me-1" /> Add New Product
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