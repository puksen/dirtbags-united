import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import cragRoutes from './routes/crags.js';
import sectorRoutes from './routes/sectors.js';
import routeRoutes from './routes/routes.js';
import parkingRoutes from './routes/parking.js';
import betaNoteRoutes from './routes/betanotes.js';
import tickRoutes from './routes/ticks.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/crags', cragRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/betanotes', betaNoteRoutes);
app.use('/api/ticks', tickRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dirtbags')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
