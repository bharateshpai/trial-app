import React, { useState } from 'react';
import './CheckoutForm.css';

interface CheckoutFormProps {
  onClose: () => void;
  onSubmit: (email: string, phone: string) => void;
  total: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, onSubmit, total }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({ email: '', phone: '' });

  const validateForm = () => {
    const newErrors = { email: '', phone: '' };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Phone validation (basic international format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number with country code (e.g., +1234567890)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(email, phone);
    }
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Checkout</h2>
        <p className="total-amount">Total Amount: ${total.toFixed(2)}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <button type="submit" className="pay-now-button">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm; 