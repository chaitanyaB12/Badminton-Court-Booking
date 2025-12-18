import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin-login';

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
      const res = await API.post(endpoint, { email, password });

      const tokenKey = isAdmin ? 'adminToken' : 'token';
      const userKey = isAdmin ? 'admin' : 'user';

      localStorage.setItem(tokenKey, res.data.data.token);
      localStorage.setItem(userKey, JSON.stringify(res.data.data.user));

      const redirectPath = isAdmin ? '/admin' : '/booking';
      navigate(redirectPath);
    } catch (err) {
      // Check if user not found error
      if (err.response?.data?.message === 'Invalid email or password' || 
          err.response?.status === 400) {
        
        const signupLink = isAdmin ? '/admin-signup' : '/signup';
        setError(
          <>
            User not found. <a href={signupLink} style={{ color: '#667eea', textDecoration: 'underline' }}>
              Create an account
            </a>
          </>
        );
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const title = isAdmin ? 'Admin Login' : 'User Login';
  const signupLink = isAdmin ? '/admin-signup' : '/signup';
  const otherLink = isAdmin ? '/login' : '/admin-login';
  const otherText = isAdmin ? 'User Login' : 'Admin Login';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1> Court Booking</h1>
        <h2>{title}</h2>
        
        {error && (
          <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter User Login Email"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href={signupLink}>Sign up</a>
        </p>

        <p className="auth-link">
          {isAdmin ? '👤 ' : '⚙️ '}
          <a href={otherLink}>{otherText}</a>
        </p>
      </div>
    </div>
  );
}
