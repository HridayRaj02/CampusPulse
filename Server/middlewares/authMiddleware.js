const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication is required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace-this-development-secret');
    if (payload.demo) { req.user = { _id: payload.id, role: payload.role, name: payload.role === 'admin' ? 'Alex Morgan' : 'Elena Rostova' }; return next(); }
    req.user = await User.findById(payload.id);
    if (!req.user) return res.status(401).json({ error: 'Account no longer exists.' });
    next();
  } catch (_error) {
    res.status(401).json({ error: 'Your session is invalid or has expired.' });
  }
};
