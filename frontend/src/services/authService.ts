interface AuthResponse {
  token?: string;
  message?: string;
  error?: string;
}

interface User {
  username: string;
  password: string;
  email: string;
  captchaToken?: string;
}

const API_URL = 'http://localhost:8080';

export const authService = {
  async register(user: User): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Registration failed' };
    }
  },

  async login(user: User): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      return { error: 'Login failed' };
    }
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Failed to process forgot password request' };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Failed to reset password' };
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },
}; 