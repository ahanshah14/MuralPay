import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { adminApi } from '../services/api';

interface PriceEditorProps {
  product: Product;
  onPriceUpdated: () => void;
}

const PriceEditor: React.FC<PriceEditorProps> = ({ product, onPriceUpdated }) => {
  const [price, setPrice] = useState(product.price_usdc);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Sync local state with product prop when it changes
  useEffect(() => {
    setPrice(product.price_usdc);
    setMessage(null);
  }, [product.price_usdc]);

  const handleUpdate = async () => {
    if (price === product.price_usdc) {
      setMessage('Price unchanged');
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    try {
      await adminApi.updatePrice(product.id, price);
      setMessage('Price updated successfully!');
      onPriceUpdated();
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || 'Failed to update price. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Ensure image path is correct - if it starts with /images, use it as-is (Vite public folder)
  const imageSrc = product.image_path.startsWith('/') 
    ? product.image_path 
    : `/images/${product.image_path}`;

  return (
    <div style={editorStyle}>
      <div style={productInfoStyle}>
        <img
          src={imageSrc}
          alt={product.name}
          style={thumbnailStyle}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50?text=' + product.name;
          }}
        />
        <span style={nameStyle}>{product.name}</span>
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Price (USDC):</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
          disabled={isUpdating}
        />
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          style={updateButtonStyle}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>
      {message && (
        <p style={messageStyle}>{message}</p>
      )}
    </div>
  );
};

const editorStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#f9f9f9',
};

const productInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
};

const thumbnailStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const nameStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#333',
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#666',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  width: '120px',
};

const updateButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const messageStyle: React.CSSProperties = {
  margin: '8px 0 0 0',
  fontSize: '12px',
  color: '#666',
  fontStyle: 'italic',
};

export default PriceEditor;

