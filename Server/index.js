const express = require('express');
require('dotenv').config();
const campusRoutes = require('./routes/campusRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const connectDatabase = require('./config/database');

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', campusRoutes);

connectDatabase();
app.listen(port, () => console.log(`Campus Pulse API listening on http://localhost:${port}`));
