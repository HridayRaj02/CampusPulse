const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = () => process.env.JWT_SECRET || 'replace-this-development-secret';
const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email, level: user.level, role: user.role });
const createToken = (user) => jwt.sign({ id: user._id }, secret(), { expiresIn: '7d' });

exports.demoLogin = (req, res) => {
  const role = req.body?.role === 'admin' ? 'admin' : 'student';
  const user = role === 'admin'
    ? { id: 'demo-admin', name: 'Alex Morgan', email: 'admin@campuspulse.dev', level: 99, role, demo: true }
    : { id: 'demo-elena', name: 'Elena Rostova', email: 'demo@campuspulse.dev', level: 28, role, demo: true };
  const token = jwt.sign({ id: user.id, role, demo: true }, secret(), { expiresIn: '7d' });
  res.json({ token, user });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must contain at least 8 characters.' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ error: 'An account with that email already exists.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: createToken(user), user: userPayload(user) });
  } catch (error) {
    res.status(500).json({ error: 'Could not create your account.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ error: 'Email or password is incorrect.' });
    res.json({ token: createToken(user), user: userPayload(user) });
  } catch (error) {
    res.status(500).json({ error: 'Could not sign you in.' });
  }
};

exports.me = async (req, res) => res.json({ user: userPayload(req.user) });
