import React, { useEffect, useState, useCallback } from 'react';
import { productApi } from '../services/api';
import type { Product } from '../types';
import PriceEditor from '../components/PriceEditor';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div style={containerStyle}>Loading products...</div>;
  }

  if (error) {
    return <div style={containerStyle}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin Portal - Price Management</h1>
      <div style={listStyle}>
        {products.map((product) => (
          <PriceEditor
            key={product.id}
            product={product}
            onPriceUpdated={fetchProducts}
          />
        ))}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  marginBottom: '24px',
  color: '#333',
  textAlign: 'center',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

export default Admin;

