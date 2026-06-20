import React, { useState, useEffect } from 'react';
import { productApi } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [showLowStock, setShowLowStock] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts({
        search: searchTerm,
        limit: 100
      });
      setProducts(response.data.items || []);
      setTotal(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const response = await productApi.getLowStock(10);
      setProducts(response.data || []);
      setTotal(response.data.length || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load low stock products');
      console.error('Error fetching low stock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showLowStock) {
      fetchLowStock();
    } else {
      fetchProducts();
    }
  }, [searchTerm, showLowStock]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      return;
    }
    try {
      await productApi.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product. It may have existing orders.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Products ({total})</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
          <button
            className={`btn ${showLowStock ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setShowLowStock(!showLowStock)}
          >
            {showLowStock ? 'Show All' : 'Low Stock'}
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-info">
          {showLowStock ? 'No low stock products found.' : 'No products found.'}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className={product.stock_quantity < 10 ? 'table-warning' : ''}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>
                    {product.stock_quantity}
                    {product.stock_quantity < 10 && (
                      <span className="badge bg-warning ms-2">Low</span>
                    )}
                  </td>
                  <td>{new Date(product.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => window.location.href = `/products/edit/${product.id}`}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;