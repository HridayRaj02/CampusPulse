const students = [
  { id: 1, name: 'Elena Rostova', level: 28, role: 'Grandmaster Coder', year: 'Computer Science · Year 3', tags: ['Academics', 'Hackathons', 'Esports'], status: 'ONLINE', color: 'cyan', initials: 'ER' },
  { id: 2, name: 'Kai Takahashi', level: 34, role: 'Esports Guild Leader', year: 'Game Design · Year 4', tags: ['Esports', 'Game Engine Lab'], status: 'IN MATCH', color: 'violet', initials: 'KT' },
  { id: 3, name: 'Maya Lin', level: 24, role: 'Design Systems Lead', year: 'Human Computer Interaction · Year 3', tags: ['Academics', 'Design Guild'], status: 'ONLINE', color: 'amber', initials: 'ML' },
  { id: 4, name: 'Liam Chen', level: 21, role: 'Open Source Maintainer', year: 'Software Engineering · Year 2', tags: ['Open Source', 'Hackathons'], status: 'AVAILABLE', color: 'green', initials: 'LC' },
];

let activities = [
  { id: 1, category: 'ACADEMICS // HACKATHON', title: 'Winner — 1st Place CodeSphere 48H Hackathon', description: 'Engineered a high-throughput real-time consensus network module.', xp: 450, time: 'Yesterday · 9:30 PM', accent: 'cyan' },
  { id: 2, category: 'ESPORTS // VARSITY TOURNAMENT', title: 'Inter-Collegiate Valorant Playoffs — 2-0 Victory', description: 'Match MVP and shotcaller telemetry logged. 28 frags / 4 clutches secured.', xp: 200, time: '3 days ago', accent: 'violet' },
  { id: 3, category: 'CAMPUS // LEADERSHIP', title: 'Hosted the AI Builders campus briefing', description: '120 students joined the launch session for the new research guild.', xp: 120, time: '5 days ago', accent: 'amber' },
];
let privacy = { profile: 'Campus', activity: 'Connections', squads: true };

module.exports = { students, getActivities: () => activities, addActivity: (item) => { activities = [item, ...activities]; return item }, getPrivacy: () => privacy, setPrivacy: (changes) => { privacy = { ...privacy, ...changes }; return privacy } };
