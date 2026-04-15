import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    crag_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crag', required: true },
    sector_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector' },
    name: { type: String, required: true, trim: true },
    topo_grade: { type: String },
    community_grade_min: { type: String },
    community_grade_max: { type: String },
    height_m: { type: Number },
    style_tags: [{ type: String }],
    safety_info: { type: String },
    status: { type: String, enum: ['active', 'hidden'], default: 'active' },
    topo_image: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Route', routeSchema);
