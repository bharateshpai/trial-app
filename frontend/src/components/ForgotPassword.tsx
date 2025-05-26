import React, { useState } from 'react';
import { authService } from '../services/authService';

interface ForgotPasswordProps {
  onLoginClick: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('If your email is registered, you will receive reset instructions.');
        setEmail('');
      }
    } catch (err) {
      setError('Failed to process request. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
        <p className="switch-auth">
          Remember your password?{' '}
          <button onClick={onLoginClick} className="link-button">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}; 