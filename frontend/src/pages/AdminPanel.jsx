import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPanel.css';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function AdminPanel() {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const res = await API.get('/bookings/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllBookings(res.data.data || []);
      } catch (err) {
        console.log('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>⚙️ Admin Panel</h1>
          <p>Manage all court bookings</p>
        </div>
        <div className="admin-header-right">
          <span className="admin-email">{admin.email}</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-content">
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <h3>Dashboard</h3>
              <ul>
                <li className="active">📋 All Bookings</li>
              </ul>
            </nav>
          </div>

          <div className="admin-main">
            <div className="admin-card">
              <div className="card-header">
                <h2>📋 All Bookings</h2>
               
              </div>

              {loading ? (
                <div className="loading">Loading bookings...</div>
              ) : allBookings.length === 0 ? (
                <div className="no-data">
                  <p>No bookings yet</p>
                  <p className="hint">Bookings will appear here</p>
                </div>
              ) : (
                <div className="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User Email</th>
                        <th>Court</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBookings.map((booking, idx) => (
                        <tr key={idx}>
                          <td>{booking.userEmail || 'Unknown'}</td>
                          <td>{booking.courtName}</td>
                          <td>{new Date(booking.date).toLocaleDateString()}</td>
                          <td>{booking.time}</td>
                          <td>₹{booking.price}</td>
                          <td>
                            <span className="status-badge confirmed">
                              {booking.status || 'Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
