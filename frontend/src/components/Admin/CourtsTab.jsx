export default function CourtsTab({
  courts,
  newCourt,
  onCourtChange,
  onAddCourt
}) {
  return (
    <div>
      <h2>Courts</h2>
      <div className="form-section">
        <h3>Add New Court</h3>
        <input
          type="text"
          placeholder="Court name"
          value={newCourt.name}
          onChange={(e) => onCourtChange({ ...newCourt, name: e.target.value })}
          className="input"
        />
        <select
          value={newCourt.type}
          onChange={(e) => onCourtChange({ ...newCourt, type: e.target.value })}
          className="input"
        >
          <option>INDOOR</option>
          <option>OUTDOOR</option>
        </select>
        <input
          type="number"
          placeholder="Base price"
          value={newCourt.basePrice}
          onChange={(e) => onCourtChange({ ...newCourt, basePrice: Number(e.target.value) })}
          className="input"
        />
        <button onClick={onAddCourt} className="btn-add">Add Court</button>
      </div>

      <div className="items-list">
        {courts.map(court => (
          <div key={court._id} className="item">
            <div>
              <h4>{court.name}</h4>
              <p>{court.type} - ₹{court.basePrice}/hr</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
