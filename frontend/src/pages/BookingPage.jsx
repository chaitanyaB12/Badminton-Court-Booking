import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookingPage.css';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const COURTS = [
  { id: 1, name: 'Indoor Court ', price: 500 },
  { id: 2, name: 'Outdoor Court ', price: 500 },
  { id: 3, name: 'Indoor Court', price: 600 },
  { id: 4, name: 'Outdoor Court', price: 600 }
];

const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM',
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Get today's date as default
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/user-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.data || []);
    } catch  {
      console.log('No bookings yet');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (loading) return;
    
    if (!selectedCourt || !selectedTime || !selectedDate) {
      setMessage('Please select court, date, and time');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const courtData = COURTS.find(c => c.id === selectedCourt);
      
       await API.post('/create',
        {
          courtId: selectedCourt,
          date: selectedDate,
          time: selectedTime,
          price: courtData.price
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Booking confirmed!');
      setSelectedCourt(null);
      setSelectedTime(null);
      fetchBookings();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="booking-page">
      <header className="booking-header">
        <div className="header-left">
          <h1> Court Booking</h1>
          <p>Book your court now</p>
        </div>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="booking-container">
        {/* Left Side - Booking Form */}
        <div className="booking-form-section">
          <div className="form-card">
            <h2>📅 Make a Booking</h2>

            {message && <div className="message">{message}</div>}

            <form onSubmit={handleBooking}>
              {/* Date Selection */}
              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-date"
                />
              </div>

              {/* Court Selection */}
              <div className="form-group">
                <label>Select Court</label>
                <div className="courts-grid">
                  {COURTS.map(court => (
                    <button
                      key={court.id}
                      type="button"
                      className={`court-card ${selectedCourt === court.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCourt(court.id)}
                    >
                      <div className="court-name">{court.name}</div>
                      <div className="court-price">₹{court.price}/hr</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="form-group">
                <label>Select Time Slot</label>
                <div className="time-slots-grid">
                  {TIME_SLOTS.map(time => (
                    <button
                      key={time}
                      type="button"
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Summary */}
              {selectedCourt && selectedTime && (
                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <p><strong>Court:</strong> {COURTS.find(c => c.id === selectedCourt)?.name}</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p className="price">
                    <strong>Price:</strong> ₹{COURTS.find(c => c.id === selectedCourt)?.price}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedCourt || !selectedTime}
                className="btn-book"
              >
                {loading ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - My Bookings */}
        <div className="my-bookings-section">
          <div className="bookings-card">
            <h2>📋 My Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <p>No bookings yet</p>
                <p className="hint">Book a court to see it here</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking, idx) => (
                  <div key={idx} className="booking-item">
                    <div className="booking-info">
                      <div className="booking-court">
                        🎾 {booking.courtName}
                      </div>
                      <div className="booking-details">
                        <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                        <span>⏰ {booking.time}</span>
                      </div>
                      <div className="booking-price">
                        ₹{booking.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
