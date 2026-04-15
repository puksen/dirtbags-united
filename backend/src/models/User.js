import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nickname: { type: String, required: true, unique: true, trim: true },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('User', userSchema);
