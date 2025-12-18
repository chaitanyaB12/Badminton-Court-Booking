import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';


const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/admin-login', { email, password });
      
      // Check if admin
      if (!res.data.data.user.isAdmin) {
        setError('Only admins can login here');
        return;
      }

      localStorage.setItem('adminToken', res.data.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🎾 Court Booking</h1>
        <h2>Admin Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Admin Login Email"
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
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <p className="auth-link">
          Back to <a href="/login">User Login</a>
        </p>
      </div>
    </div>
  );
}
