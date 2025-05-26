import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import Solitaire from './components/Solitaire';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getToken());
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    // Check for reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
    setShowForgotPassword(false);
    setResetToken('');
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  const handleLoginClick = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    setResetToken('');
  };

  if (isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>Welcome!</h2>
          <button onClick={handleLogout} className="submit-button">
            Logout
          </button>
        </div>
        <Solitaire />
      </div>
    );
  }

  if (resetToken) {
    return (
      <ResetPassword
        token={resetToken}
        onSuccess={handleAuthSuccess}
        onLoginClick={handleLoginClick}
      />
    );
  }

  if (showForgotPassword) {
    return <ForgotPassword onLoginClick={handleLoginClick} />;
  }

  if (showRegister) {
    return (
      <Register
        onSuccess={handleAuthSuccess}
        onLoginClick={handleLoginClick}
      />
    );
  }

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login
          onSuccess={handleAuthSuccess}
          onRegisterClick={() => setCurrentView('register')}
          onForgotPasswordClick={() => setCurrentView('forgot-password')}
        />
      )}
    </div>
  );
}

export default App; 