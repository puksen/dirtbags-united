import mongoose from 'mongoose';

const sectorSchema = new mongoose.Schema(
  {
    crag_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crag', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Sector', sectorSchema);
