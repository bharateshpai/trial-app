import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { authService } from '../services/authService';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';  // Test key for localhost

interface LoginProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onRegisterClick, onForgotPasswordClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({ 
        username, 
        password, 
        email: '',
        captchaToken 
      });
      
      if (response.error) {
        setError(response.error);
        recaptchaRef.current?.reset();
      } else if (response.token) {
        setUsername('');
        setPassword('');
        onSuccess();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      recaptchaRef.current?.reset();
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group captcha-container">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              theme="light"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="switch-auth">
          Don't have an account?{' '}
          <button onClick={onRegisterClick} className="link-button">
            Register
          </button>
        </p>
        <p className="switch-auth">
          Forgot your password?{' '}
          <button onClick={onForgotPasswordClick} className="link-button">
            Reset it here
          </button>
        </p>
      </div>
    </div>
  );
}; 