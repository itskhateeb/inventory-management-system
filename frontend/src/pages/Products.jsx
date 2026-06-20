import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const Products = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <Link to="/products/new" className="btn btn-primary">
          Add New Product
        </Link>
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