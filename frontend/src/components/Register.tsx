import React, { useState } from 'react';
import { authService } from '../services/authService';

interface RegisterProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSuccess, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register({ username, password, email });
      if (response.error) {
        setError(response.error);
      } else {
        setUsername('');
        setPassword('');
        setEmail('');
        onSuccess();
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={6}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="switch-auth">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="link-button">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}; 