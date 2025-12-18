import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function AdminSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('All fields required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/admin-signup', { 
        email, 
        password
      });

      localStorage.setItem('adminToken', res.data.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.data.user));
      navigate('/admin-login');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🎾 Court Booking</h1>
        <h2>Admin Signup</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleAdminSignup}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter a Email"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a Password"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter Password Again"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-full"
          >
            {loading ? 'Creating admin account...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have admin account? <a href="/admin-login">Login here</a>
        </p>

        <p className="auth-link">
          User? <a href="/login">User login</a>
        </p>
      </div>
    </div>
  );
}
