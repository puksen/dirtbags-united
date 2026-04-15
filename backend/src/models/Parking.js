import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema(
  {
    crag_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crag', required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: { type: [Number], required: true },
    },
    description: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

parkingSchema.index({ location: '2dsphere' });

export default mongoose.model('Parking', parkingSchema);
