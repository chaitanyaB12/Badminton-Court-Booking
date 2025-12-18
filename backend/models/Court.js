const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['INDOOR', 'OUTDOOR'], required: true },
  basePrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Court', courtSchema);
