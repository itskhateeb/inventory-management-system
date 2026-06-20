import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
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
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/products')}`} to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">
                Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/orders')}`} to="/orders">
                Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;