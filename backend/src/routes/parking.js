import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Parking from '../models/Parking.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { crag_id } = req.query;
    const filter = crag_id ? { crag_id } : {};
    const spots = await Parking.find(filter).lean();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('crag_id').notEmpty(),
    body('location.coordinates').isArray({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const body = req.body;
      if (!body.location.type) body.location.type = 'Point';
      const spot = await Parking.create(body);
      res.status(201).json(spot);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const spot = await Parking.findById(req.params.id).lean();
    if (!spot) return res.status(404).json({ error: 'Not found' });
    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const spot = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!spot) return res.status(404).json({ error: 'Not found' });
    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const spot = await Parking.findByIdAndDelete(req.params.id);
    if (!spot) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
