import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './contexts/CartContext';
import Catalog from './pages/Catalog';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';

const Navigation: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav style={navStyle}>
      <div style={navContentStyle}>
        <Link to="/" style={linkStyle}>
          Catalog
        </Link>
        <Link to="/admin" style={linkStyle}>
          Admin
        </Link>
        <Link to="/checkout" style={cartLinkStyle}>
          <span>Cart</span>
          {totalItems > 0 && (
            <span style={badgeStyle}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div style={appStyle}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

const appStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
};

const navStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '20px',
};

const navContentStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
};

const linkStyle: React.CSSProperties = {
  marginRight: '20px',
  textDecoration: 'none',
  color: '#007bff',
  fontSize: '16px',
  fontWeight: '500',
};

const cartLinkStyle: React.CSSProperties = {
  marginLeft: 'auto',
  textDecoration: 'none',
  color: '#007bff',
  fontSize: '16px',
  fontWeight: '500',
  position: 'relative',
  paddingRight: '10px',
};

const badgeStyle: React.CSSProperties = {
  marginLeft: '8px',
  backgroundColor: '#28a745',
  color: 'white',
  borderRadius: '50%',
  padding: '2px 8px',
  fontSize: '12px',
  fontWeight: 'bold',
  minWidth: '20px',
  display: 'inline-block',
  textAlign: 'center',
};

export default App;

