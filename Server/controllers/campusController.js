const data = require('../models/campusData');

exports.getProfile = (_req, res) => res.json({ student: data.students[0], xp: 8240, nextLevelXp: 10000, gpa: '3.92', rank: 'TOP 5%' });
exports.getStudents = (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const domain = req.query.domain || 'All';
  const students = data.students.filter((student) => {
    const indexed = `${student.name} ${student.role} ${student.year} ${student.tags.join(' ')}`.toLowerCase();
    return (!query || indexed.includes(query)) && (domain === 'All' || student.tags.includes(domain));
  });
  res.json({ students });
};
exports.getActivities = (_req, res) => res.json({ activities: data.getActivities() });
exports.createActivity = (req, res) => {
  const { title, description, category = 'CAMPUS // FIELD LOG', xp = 50 } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required.' });
  const activity = data.addActivity({ id: Date.now(), title, description, category, xp: Number(xp), time: 'Just now', accent: 'cyan' });
  res.status(201).json({ activity });
};
exports.getPrivacy = (_req, res) => res.json({ privacy: data.getPrivacy() });
exports.updatePrivacy = (req, res) => res.json({ privacy: data.setPrivacy(req.body) });
