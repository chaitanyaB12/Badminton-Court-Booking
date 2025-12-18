import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courtName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum:['pending', 'confirmed', 'completed'],default: 'pending' },
  },
  { timestamps: true }
);

bookingSchema.index({ date: 1, time: 1, courtName: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);
