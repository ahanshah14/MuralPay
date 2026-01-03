import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(`Added ${quantity} ${product.name}(s) to cart!`);
    setTimeout(() => setAddedMessage(null), 2000);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Ensure image path is correct - if it starts with /images, use it as-is (Vite public folder)
  const imageSrc = product.image_path.startsWith('/') 
    ? product.image_path 
    : `/images/${product.image_path}`;

  return (
    <div style={cardStyle}>
      <img
        src={imageSrc}
        alt={product.name}
        style={imageStyle}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=' + product.name;
        }}
      />
      <div style={infoStyle}>
        <h3 style={nameStyle}>{product.name}</h3>
        <p style={priceStyle}>{product.price_usdc} USDC</p>
        <div style={quantityContainerStyle}>
          <label style={labelStyle}>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            style={inputStyle}
          />
        </div>
        <button
          onClick={handleAddToCart}
          style={buttonStyle}
        >
          Add to Cart
        </button>
        {addedMessage && (
          <p style={messageStyle}>{addedMessage}</p>
        )}
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  textAlign: 'center',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '4px',
  marginBottom: '12px',
};

const infoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const nameStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
};

const priceStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '16px',
  color: '#666',
  fontWeight: '500',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  marginTop: '8px',
};

const messageStyle: React.CSSProperties = {
  margin: '8px 0 0 0',
  fontSize: '12px',
  color: '#28a745',
  fontStyle: 'italic',
  fontWeight: '500',
};

const quantityContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'center',
  marginTop: '8px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#333',
  fontWeight: '500',
};

const inputStyle: React.CSSProperties = {
  width: '60px',
  padding: '6px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  textAlign: 'center',
};

export default ProductCard;

