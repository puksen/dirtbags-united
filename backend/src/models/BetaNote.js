import mongoose from 'mongoose';

const betaNoteSchema = new mongoose.Schema(
  {
    route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, maxlength: 500 },
    visibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('BetaNote', betaNoteSchema);
