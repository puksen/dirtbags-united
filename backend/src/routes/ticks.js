import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Tick from '../models/Tick.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { route_id } = req.query;
    if (!route_id) return res.status(400).json({ error: 'route_id required' });
    const ticks = await Tick.find({ route_id }).populate('user_id', 'nickname').lean();
    res.json(ticks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('route_id').notEmpty(),
    body('style').isIn(['onsight', 'flash', 'rotpunkt', 'toprope']),
    body('rating').optional().isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const tick = await Tick.create({ ...req.body, user_id: req.user.id });
      res.status(201).json(tick);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
