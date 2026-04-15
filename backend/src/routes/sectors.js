import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Sector from '../models/Sector.js';
import { requireAuth, isValidObjectId } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { crag_id } = req.query;
    if (crag_id && !isValidObjectId(crag_id)) return res.status(400).json({ error: 'Invalid crag_id' });
    const filter = crag_id ? { crag_id } : {};
    const sectors = await Sector.find(filter).lean();
    res.json(sectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  requireAuth,
  [body('name').trim().notEmpty(), body('crag_id').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const sector = await Sector.create(req.body);
      res.status(201).json(sector);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const sector = await Sector.findById(req.params.id).lean();
    if (!sector) return res.status(404).json({ error: 'Not found' });
    res.json(sector);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const sector = await Sector.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sector) return res.status(404).json({ error: 'Not found' });
    res.json(sector);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const sector = await Sector.findByIdAndDelete(req.params.id);
    if (!sector) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
