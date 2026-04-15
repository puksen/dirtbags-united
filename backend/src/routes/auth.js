import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = Router();
const SALT_ROUNDS = 12;

router.post(
  '/register',
  [
    body('nickname').trim().notEmpty().withMessage('Nickname required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { nickname, email, password } = req.body;
      const existing = await User.findOne({ nickname });
      if (existing) return res.status(409).json({ error: 'Nickname taken' });

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({ nickname, email: email || undefined, password_hash });

      const token = jwt.sign(
        { id: user._id, nickname: user.nickname, role: user.role },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      res.status(201).json({ token, user: { id: user._id, nickname: user.nickname, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post(
  '/login',
  [
    body('nickname').trim().notEmpty(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { nickname, password } = req.body;
      const user = await User.findOne({ nickname });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user._id, nickname: user.nickname, role: user.role },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      res.json({ token, user: { id: user._id, nickname: user.nickname, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
