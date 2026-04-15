import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const token = header.slice(7);
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    } catch {
      // ignore invalid token
    }
  }
  next();
}

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
