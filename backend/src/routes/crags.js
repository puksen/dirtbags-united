import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';
import Crag from '../models/Crag.js';
import Sector from '../models/Sector.js';
import Route from '../models/Route.js';
import Parking from '../models/Parking.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'src/uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { lat, lng, radius = 50000, limit = 50 } = req.query;
    let filter = {};
    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }
    const crags = await Crag.find(filter).limit(parseInt(limit)).lean();
    res.json(crags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates [lng, lat] required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const cragData = { ...req.body, created_by: req.user.id };
      if (!cragData.location) return res.status(400).json({ error: 'location required' });
      if (!cragData.location.type) cragData.location.type = 'Point';
      const crag = await Crag.create(cragData);
      res.status(201).json(crag);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const crag = await Crag.findById(req.params.id).lean();
    if (!crag) return res.status(404).json({ error: 'Crag not found' });

    const [sectors, routes, parking] = await Promise.all([
      Sector.find({ crag_id: crag._id }).lean(),
      Route.find({ crag_id: crag._id, status: 'active' })
        .select('name topo_grade community_grade_min community_grade_max height_m style_tags sector_id')
        .lean(),
      Parking.find({ crag_id: crag._id }).lean(),
    ]);

    res.json({ ...crag, sectors, routes, parking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const crag = await Crag.findById(req.params.id);
    if (!crag) return res.status(404).json({ error: 'Crag not found' });
    if (String(crag.created_by) !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    Object.assign(crag, req.body);
    await crag.save();
    res.json(crag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const crag = await Crag.findById(req.params.id);
    if (!crag) return res.status(404).json({ error: 'Crag not found' });
    if (String(crag.created_by) !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await crag.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/photos', requireAuth, upload.array('photos', 10), async (req, res) => {
  try {
    const crag = await Crag.findById(req.params.id);
    if (!crag) return res.status(404).json({ error: 'Crag not found' });

    const savedPaths = [];
    for (const file of req.files) {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const dest = path.join(UPLOAD_DIR, filename);
      await sharp(file.buffer)
        .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(dest);
      savedPaths.push(`/uploads/${filename}`);
    }
    crag.photos.push(...savedPaths);
    await crag.save();
    res.json({ photos: crag.photos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
