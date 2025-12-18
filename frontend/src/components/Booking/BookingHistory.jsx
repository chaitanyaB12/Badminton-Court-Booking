export default function BookingHistory({
  bookings,
  onBack,
  onCancel
}) {
  return (
    <div className="page">
      <h2>My Bookings</h2>
      <button onClick={onBack} className="btn-back">Back to Booking</button>
      
      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <p><strong>Court:</strong> {booking.court?.name}</p>
              <p><strong>Date:</strong> {booking.bookingDate}</p>
              <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
              <p><strong>Total:</strong> ₹{booking.priceBreakdown.total}</p>
              <p><strong>Status:</strong> <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
              
              {booking.status === 'CONFIRMED' && (
                <button 
                  onClick={() => onCancel(booking._id)} 
                  className="btn-cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
