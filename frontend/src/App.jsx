import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Products from './pages/Products';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container-fluid mt-3">
          <Routes>
            <Route path="/" element={<div className="text-center py-5"><h1>Welcome to Inventory Management System</h1><p className="text-muted">Select a module from the navigation above</p></div>} />
            <Route path="/products/*" element={<Products />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;