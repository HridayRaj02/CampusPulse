const express = require('express');
require('dotenv').config();
const campusRoutes = require('./routes/campusRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const connectDatabase = require('./config/database');

const app = express();
const port = process.env.PORT || 5001;

// The Vercel frontend and Render API are different origins. Set CLIENT_ORIGIN
// to the Vercel URL (or a comma-separated list) in production to restrict it.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowed = !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin);

  if (origin && !allowed) return res.status(403).json({ error: 'Origin is not allowed.' });
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.length ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (allowedOrigins.length) res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', campusRoutes);

connectDatabase();
app.listen(port, () => console.log(`Campus Pulse API listening on port ${port}`));
