
export default function CourtSelector({ courts, selectedCourt, onSelectCourt }) {
  return (
    <div className="section">
      <h2>Select Court</h2>
      <div className="courts-grid">
        {courts.map(court => (
          <div
            key={court._id}
            className={`court-card ${selectedCourt?._id === court._id ? 'selected' : ''}`}
            onClick={() => onSelectCourt(court)}
          >
            <h3>{court.name}</h3>
            <p className="type">{court.type}</p>
            <p className="price">₹{court.basePrice}/hr</p>
          </div>
        ))}
      </div>
    </div>
  );
}
