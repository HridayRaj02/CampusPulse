const mongoose = require('mongoose');
const Event = require('../models/Event');

let demoEvents = [
  { _id: 'demo-event-1', title: 'CodeSphere 48H Hackathon', category: 'Hackathon', date: 'Oct 18 · 09:00', location: 'Innovation Lab', description: 'Build, ship and compete with the best campus teams.' },
  { _id: 'demo-event-2', title: 'Executors Playoffs', category: 'Esports', date: 'Oct 21 · 19:00', location: 'Arena B', description: 'Inter-collegiate Valorant quarterfinals.' },
];

exports.getEvents = async (_req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({ events: demoEvents });
  res.json({ events: await Event.find().sort({ createdAt: -1 }) });
};

exports.createEvent = async (req, res) => {
  const { title, category, date, location, description } = req.body;
  if (!title || !category || !date || !location || !description) return res.status(400).json({ error: 'Complete every event field.' });
  const item = { title, category, date, location, description };
  if (mongoose.connection.readyState !== 1) {
    const event = { _id: `demo-${Date.now()}`, ...item };
    demoEvents = [event, ...demoEvents];
    return res.status(201).json({ event });
  }
  const event = await Event.create({ ...item, createdBy: req.user._id });
  res.status(201).json({ event });
};
