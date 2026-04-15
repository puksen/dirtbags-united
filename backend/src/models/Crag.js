import mongoose from 'mongoose';

const cragSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    description: { type: String },
    exposure: { type: String },
    approach_time_minutes: { type: Number },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    tags: [{ type: String }],
    photos: [{ type: String }], // stored file paths
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

cragSchema.index({ location: '2dsphere' });

export default mongoose.model('Crag', cragSchema);
