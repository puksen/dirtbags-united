import mongoose from 'mongoose';

const tickSchema = new mongoose.Schema(
  {
    route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    style: { type: String, enum: ['onsight', 'flash', 'rotpunkt', 'toprope'] },
    grade_felt: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    beta: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Tick', tickSchema);
