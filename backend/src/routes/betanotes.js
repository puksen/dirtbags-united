import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import BetaNote from '../models/BetaNote.js';
import { requireAuth, optionalAuth, isValidObjectId } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { route_id } = req.query;
    if (!route_id) return res.status(400).json({ error: 'route_id required' });
    if (!isValidObjectId(route_id)) return res.status(400).json({ error: 'Invalid route_id' });

    const filter = {
      route_id,
      $or: [
        { visibility: 'public' },
        ...(req.user ? [{ author_id: req.user.id, visibility: { $in: ['friends', 'private'] } }] : []),
      ],
    };

    const notes = await BetaNote.find(filter).populate('author_id', 'nickname').lean();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('route_id').notEmpty(),
    body('body').trim().notEmpty().isLength({ max: 500 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const note = await BetaNote.create({ ...req.body, author_id: req.user.id });
      await note.populate('author_id', 'nickname');
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const note = await BetaNote.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    if (String(note.author_id) !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await note.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
