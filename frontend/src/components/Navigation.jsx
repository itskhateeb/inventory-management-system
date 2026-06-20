import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBox, FaUsers, FaShoppingCart, FaChartBar, FaHome } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <MdInventory className="me-2" size={28} />
          Inventory System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <FaChartBar className="me-1" /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/products')}`} to="/products">
                <FaBox className="me-1" /> Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">
                <FaUsers className="me-1" /> Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/orders')}`} to="/orders">
                <FaShoppingCart className="me-1" /> Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;