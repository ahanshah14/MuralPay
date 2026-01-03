import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { purchaseApi } from '../services/api';
import type { PurchaseRequest, PurchaseResponse } from '../types';

const Checkout: React.FC = () => {
  const { cartItems, clearCart, getTotalPrice, updateQuantity, removeFromCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payinResponse, setPayinResponse] = useState<PurchaseResponse | null>(null);
  const navigate = useNavigate();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPayinResponse(null);

    try {
      // Create a single Payin for the total amount
      // Use the first item's product_id for the request (API expects product_id)
      const totalPrice = getTotalPrice();
      const purchaseRequest: PurchaseRequest = {
        product_id: cartItems[0].product.id,
        amount_usdc: totalPrice.toFixed(2),
      };
      
      const response = await purchaseApi.purchase(purchaseRequest);
      setPayinResponse(response);
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Network error: Could not connect to the server. Please ensure the backend is running.');
      } else {
        setError(
          err.response?.data?.detail || err.message || 'Checkout failed. Please try again.'
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Checkout</h1>
        <div style={emptyStyle}>
          <p style={emptyTextStyle}>Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            style={buttonStyle}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Checkout</h1>
      
      <div style={cartContainerStyle}>
        <div style={itemsContainerStyle}>
          <h2 style={sectionTitleStyle}>Order Summary</h2>
          {cartItems.map((item) => {
            const imageSrc = item.product.image_path.startsWith('/') 
              ? item.product.image_path 
              : `/images/${item.product.image_path}`;
            
            const itemTotal = parseFloat(item.product.price_usdc) * item.quantity;

            return (
              <div key={item.product.id} style={cartItemStyle}>
                <img
                  src={imageSrc}
                  alt={item.product.name}
                  style={cartItemImageStyle}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=' + item.product.name;
                  }}
                />
                <div style={cartItemInfoStyle}>
                  <h3 style={cartItemNameStyle}>{item.product.name}</h3>
                  <p style={cartItemPriceStyle}>{item.product.price_usdc} USDC each</p>
                </div>
                <div style={quantityControlsStyle}>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    style={{
                      ...quantityButtonStyle,
                      ...(item.quantity <= 1 ? disabledButtonStyle : {}),
                    }}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span style={quantityValueStyle}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    style={quantityButtonStyle}
                  >
                    +
                  </button>
                </div>
                <div style={cartItemTotalStyle}>
                  <p style={itemTotalTextStyle}>{itemTotal.toFixed(2)} USDC</p>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    style={removeButtonStyle}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={summaryStyle}>
          <h2 style={sectionTitleStyle}>Total</h2>
          <div style={totalLineStyle}>
            <span style={totalLabelStyle}>Total:</span>
            <span style={totalAmountStyle}>{totalPrice.toFixed(2)} USDC</span>
          </div>
          {payinResponse?.fiat_amount_cop && (
            <div style={copAmountStyle}>
              <span style={copLabelStyle}>Amount in COP:</span>
              <span style={copAmountTextStyle}>{payinResponse.fiat_amount_cop.toFixed(2)} COP</span>
            </div>
          )}
          {error && (
            <p style={errorStyle}>{error}</p>
          )}
          {!payinResponse && (
            <>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                style={{
                  ...checkoutButtonStyle,
                  ...((isProcessing || cartItems.length === 0) ? disabledCheckoutButtonStyle : {}),
                }}
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
              <button
                onClick={() => navigate('/')}
                style={continueShoppingStyle}
              >
                Continue Shopping
              </button>
            </>
          )}
          {payinResponse && (
            <div style={payinInfoStyle}>
              <h3 style={payinTitleStyle}>Payment Instructions</h3>
              {payinResponse.payin_id && (
                <div style={payinDetailStyle}>
                  <strong>Payin ID:</strong> <span style={payinIdStyle}>{payinResponse.payin_id}</span>
                </div>
              )}
              {payinResponse.payin_status && (
                <div style={payinDetailStyle}>
                  <strong>Status:</strong> <span style={statusStyle}>{payinResponse.payin_status.type}</span>
                </div>
              )}
              {payinResponse.payin_instructions?.depositUrl && (
                <div style={payinDetailStyle}>
                  <a
                    href={payinResponse.payin_instructions.depositUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={paymentLinkStyle}
                  >
                    Pay with COP PSE
                  </a>
                </div>
              )}
              {payinResponse.payin_instructions?.expiresAt && (
                <div style={payinDetailStyle}>
                  <strong>Expires at:</strong>{' '}
                  <span>{new Date(payinResponse.payin_instructions.expiresAt).toLocaleString()}</span>
                </div>
              )}
              <button
                onClick={() => {
                  clearCart();
                  setPayinResponse(null);
                  navigate('/');
                }}
                style={continueShoppingStyle}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '32px',
  marginBottom: '24px',
  color: '#333',
  textAlign: 'center',
};

const cartContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: '24px',
  alignItems: 'start',
};

const itemsContainerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#333',
  borderBottom: '2px solid #eee',
  paddingBottom: '12px',
};

const cartItemStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '100px 1fr auto auto',
  gap: '16px',
  alignItems: 'center',
  padding: '16px',
  borderBottom: '1px solid #eee',
  marginBottom: '16px',
};

const cartItemImageStyle: React.CSSProperties = {
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const cartItemInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const cartItemNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
};

const cartItemPriceStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: '#666',
};

const quantityControlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const quantityButtonStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
};

const quantityValueStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '500',
  minWidth: '30px',
  textAlign: 'center',
};

const cartItemTotalStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
};

const itemTotalTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
};

const removeButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const summaryStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: '20px',
};

const totalLineStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 0',
  borderTop: '2px solid #eee',
  marginTop: '16px',
};

const totalLabelStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
};

const totalAmountStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#007bff',
};

const checkoutButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '16px',
};

const continueShoppingStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#fff',
  color: '#007bff',
  border: '1px solid #007bff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  marginTop: '12px',
};

const disabledButtonStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

const disabledCheckoutButtonStyle: React.CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
};

const errorStyle: React.CSSProperties = {
  color: '#dc3545',
  fontSize: '14px',
  marginTop: '12px',
  padding: '8px',
  backgroundColor: '#f8d7da',
  borderRadius: '4px',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#666',
  marginBottom: '24px',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '500',
};

const copAmountStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderTop: '1px solid #eee',
  marginTop: '12px',
};

const copLabelStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#666',
};

const copAmountTextStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#28a745',
};

const payinInfoStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #dee2e6',
};

const payinTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '16px',
  marginTop: 0,
};

const payinDetailStyle: React.CSSProperties = {
  marginBottom: '12px',
  fontSize: '14px',
  color: '#333',
};

const payinIdStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '12px',
  backgroundColor: '#e9ecef',
  padding: '4px 8px',
  borderRadius: '4px',
  wordBreak: 'break-all',
};

const statusStyle: React.CSSProperties = {
  textTransform: 'capitalize',
  fontWeight: 'bold',
  color: '#007bff',
};

const paymentLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 24px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  marginTop: '8px',
  textAlign: 'center',
  width: '100%',
  boxSizing: 'border-box',
};

export default Checkout;

