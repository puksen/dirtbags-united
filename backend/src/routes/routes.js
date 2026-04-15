import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Route from '../models/Route.js';
import Crag from '../models/Crag.js';
import Sector from '../models/Sector.js';
import BetaNote from '../models/BetaNote.js';
import { requireAuth, optionalAuth, isValidObjectId } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { crag_id, sector_id } = req.query;
    if (crag_id && !isValidObjectId(crag_id)) return res.status(400).json({ error: 'Invalid crag_id' });
    if (sector_id && !isValidObjectId(sector_id)) return res.status(400).json({ error: 'Invalid sector_id' });
    const filter = { status: 'active' };
    if (crag_id) filter.crag_id = crag_id;
    if (sector_id) filter.sector_id = sector_id;
    const routes = await Route.find(filter).lean();
    res.json(routes);
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
      const route = await Route.create({ ...req.body, created_by: req.user.id });
      res.status(201).json(route);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).lean();
    if (!route) return res.status(404).json({ error: 'Route not found' });

    const [crag, sector, betaNotes] = await Promise.all([
      Crag.findById(route.crag_id).select('name area').lean(),
      route.sector_id ? Sector.findById(route.sector_id).select('name').lean() : null,
      BetaNote.find({
        route_id: route._id,
        $or: [
          { visibility: 'public' },
          ...(req.user ? [{ author_id: req.user.id }] : []),
        ],
      })
        .populate('author_id', 'nickname')
        .lean(),
    ]);

    res.json({ ...route, crag, sector, betaNotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ error: 'Not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
