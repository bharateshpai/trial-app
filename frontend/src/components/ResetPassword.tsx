import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface ResetPasswordProps {
  token: string;
  onSuccess: () => void;
  onLoginClick: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ token, onSuccess, onLoginClick }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(token, password);
      if (response.error) {
        setError(response.error);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Resetting...' : 'Reset Password'}
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