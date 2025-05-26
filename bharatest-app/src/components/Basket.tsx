import React, { useState } from 'react';
import { useBasket } from '../context/BasketContext';
import CheckoutForm from './CheckoutForm';
import './Basket.css';

const Basket: React.FC = () => {
  const { basket, removeFromBasket, getTotalPrice } = useBasket();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleCheckout = () => {
    setShowCheckoutForm(true);
  };

  const handlePayment = (email: string, phone: string) => {
    // Here you would typically integrate with a payment processor
    alert(`Processing payment...\nEmail: ${email}\nPhone: ${phone}\nTotal: $${getTotalPrice().toFixed(2)}`);
    setShowCheckoutForm(false);
  };

  if (basket.length === 0) {
    return (
      <div className="basket empty-basket">
        <p>Your basket is empty</p>
      </div>
    );
  }

  return (
    <div className="basket">
      <h2>Your Basket</h2>
      {basket.map(item => (
        <div key={item.id} className="basket-item">
          <img src={item.image} alt={item.name} className="basket-item-image" />
          <div className="basket-item-details">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button
            onClick={() => removeFromBasket(item.id)}
            className="remove-item"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="basket-total">
        <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
        <button onClick={handleCheckout} className="checkout-button">
          Proceed to Checkout
        </button>
      </div>

      {showCheckoutForm && (
        <CheckoutForm
          onClose={() => setShowCheckoutForm(false)}
          onSubmit={handlePayment}
          total={getTotalPrice()}
        />
      )}
    </div>
  );
};

export default Basket; 