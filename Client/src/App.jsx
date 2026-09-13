import { useEffect, useState } from 'react'
import './index.css'
import { Sidebar, Topbar } from './components/AppChrome.jsx'
import LoginPage from './components/LoginPage.jsx'
import AdminPanel from './components/AdminPanel.jsx'

const nav = [
  ['discover', '⌁', 'Search & Discovery'], ['profile', '◈', 'Character Sheet'], ['activity', '◫', 'Activity Feed'],
  ['squads', '◇', 'Memberships & Squads'], ['guild', '⬡', 'Guild Command'], ['scanner', '⌘', 'Advanced Scanner'], ['privacy', '◉', 'Privacy Protocol'],
]
const domains = ['All', 'Academics', 'Esports', 'Hackathons', 'Open Source']
const colorFor = (name) => name === 'violet' ? 'violet' : name === 'amber' ? 'amber' : name === 'green' ? 'green' : 'cyan'

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('campus-pulse-user') || 'null'))
  const [page, setPage] = useState('discover')
  const [students, setStudents] = useState([])
  const [activities, setActivities] = useState([])
  const [profile, setProfile] = useState(null)
  const [privacy, setPrivacy] = useState({ profile: 'Campus', activity: 'Connections', squads: true })
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('All')
  const [modal, setModal] = useState(false)
  const [toast, setToast] = useState('')

  const load = async () => {
    const [profileData, activityData, privacyData] = await Promise.all(['/api/profile', '/api/activities', '/api/privacy'].map((url) => fetch(url).then(r => r.json())))
    setProfile(profileData); setActivities(activityData.activities); setPrivacy(privacyData.privacy)
  }
  useEffect(() => { load().catch(() => setToast('Server connection unavailable. Start the API on port 5001.')) }, [])
  useEffect(() => {
    const timer = setTimeout(() => fetch(`/api/students?q=${encodeURIComponent(query)}&domain=${domain}`).then(r => r.json()).then(d => setStudents(d.students)).catch(() => {}), 180)
    return () => clearTimeout(timer)
  }, [query, domain])
  const updatePrivacy = async (change) => {
    const next = { ...privacy, ...change }; setPrivacy(next)
    await fetch('/api/privacy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(change) })
    setToast('Privacy protocol updated'); setTimeout(() => setToast(''), 2200)
  }
  const logActivity = async (event) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    const response = await fetch('/api/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) })
    if (response.ok) { const { activity } = await response.json(); setActivities([activity, ...activities]); setModal(false); setPage('activity'); setToast('New achievement logged to your feed'); setTimeout(() => setToast(''), 2600) }
  }
  const go = (destination) => { setPage(destination); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const logout = () => {
    localStorage.removeItem('campus-pulse-token')
    localStorage.removeItem('campus-pulse-user')
    setUser(null)
  }

  if (!user) return <LoginPage onAuthenticated={setUser} />

  return <div className="app-shell">
    <Topbar query={query} setQuery={setQuery} go={go} openLogger={() => setModal(true)} logout={logout} />
    <Sidebar nav={user.role === 'admin' ? [['admin', '⬢', 'Admin Command'], ...nav] : nav} page={page} go={go} />
    <main>{page === 'admin' && user.role === 'admin' && <AdminPanel/>}{page === 'discover' && <Discovery {...{query,setQuery,domain,setDomain,students,go}}/>}{page === 'profile' && <Profile profile={profile} activities={activities} go={go}/>} {page === 'activity' && <Activity activities={activities}/>} {page === 'squads' && <Squads/>}{page === 'guild' && <Guild/>}{page === 'scanner' && <Scanner {...{domain,setDomain,query,setQuery,students}}/>}{page === 'privacy' && <Privacy privacy={privacy} updatePrivacy={updatePrivacy}/>}</main>
    {modal && <ActivityModal close={() => setModal(false)} submit={logActivity}/>} {toast && <div className="toast">✓ {toast}</div>}
  </div>
}

function Discovery({ query, setQuery, domain, setDomain, students, go }) { return <section className="view"><div className="hero"><p className="eyebrow cyan-text">CAMPUS RADAR // LIVE INDEX</p><h1>DISCOVER YOUR<br/><span>CAMPUS PARTY.</span></h1><p>Find the people, guilds, and quests that turn campus life into your next legendary run.</p><div className="radar"><span>⌕</span><input autoFocus placeholder="Search students, squads, clubs, or tech tags..." value={query} onChange={e=>setQuery(e.target.value)}/><button onClick={() => go('scanner')}>ADVANCED SCANNER →</button></div></div><div className="filter-row">{domains.map(item => <button onClick={() => setDomain(item)} className={domain === item ? 'selected' : ''} key={item}>{item}</button>)}<span>{students.length} OPERATIVES FOUND</span></div><div className="section-title"><div><p className="eyebrow">PRIORITY MATCHES</p><h2>OPERATIVE DIRECTORY</h2></div><button className="ghost" onClick={() => go('scanner')}>OPEN SCANNER ↗</button></div><div className="student-grid">{students.map(student => <StudentCard key={student.id} student={student} onClick={() => go('profile')}/>)}</div>{students.length === 0 && <div className="empty">NO OPERATIVES MATCH THIS SCAN.</div>}<div className="quest-banner"><div><p className="eyebrow amber-text">LIVE CAMPUS EVENT // 04D 12H REMAINING</p><h2>CODE<span>SPHERE</span> 48H HACKATHON</h2><p>Form a squad, pick a problem and claim your place on the campus leaderboard.</p></div><button className="primary amber">VIEW QUEST DETAILS →</button></div></section> }
function StudentCard({student,onClick}) { return <button className="student-card" onClick={onClick}><div className="card-top"><span className={`avatar large ${colorFor(student.color)}`}>{student.initials}</span><span className={`status ${colorFor(student.color)}`}>● {student.status}</span></div><h3>{student.name}</h3><p>LVL {student.level} · {student.role}</p><small>{student.year}</small><div className="tag-row">{student.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="card-foot">VIEW CHARACTER SHEET <b>→</b></div></button> }
function Profile({profile,activities,go}) { const p = profile || {student:{name:'Elena Rostova',level:28,role:'Grandmaster Coder'},xp:8240,nextLevelXp:10000,gpa:'3.92',rank:'TOP 5%'}; return <section className="view"><div className="profile-hero"><div className="profile-avatar">ER<div className="level">LVL {p.student.level}</div></div><div><p className="eyebrow cyan-text">VERIFIED STUDENT // ID 9274</p><h1>{p.student.name}</h1><h2>{p.student.role} <span>✓ VERIFIED</span></h2><p className="muted">Computer Science · Year 3 · Main Campus</p><div className="tag-row"><span>ACADEMICS</span><span>HACKATHONS</span><span>ESPORTS</span></div></div><button className="ghost">EDIT LOADOUT</button></div><div className="stat-grid"><Stat label="CURRENT LEVEL" value={`LVL ${p.student.level}`}/><Stat label="ACADEMIC RATING" value={`${p.gpa} GPA`} color="cyan"/><Stat label="CAMPUS RANK" value={p.rank} color="amber"/><Stat label="TOTAL XP" value={p.xp.toLocaleString()} color="violet"/></div><div className="two-col"><div className="panel"><div className="panel-header"><div><p className="eyebrow">PROGRESSION MODULE</p><h2>XP TELEMETRY</h2></div><b>{p.xp.toLocaleString()} / {p.nextLevelXp.toLocaleString()} XP</b></div><div className="segmented"><i style={{width:`${p.xp/p.nextLevelXp*100}%`}}/></div><div className="metric-list"><Metric label="COGNITIVE" value="92" color="cyan"/><Metric label="CREATIVITY" value="87" color="violet"/><Metric label="STAMINA" value="76" color="green"/></div></div><div className="panel"><div className="panel-header"><div><p className="eyebrow">ACTIVE LOADOUT</p><h2>MEMBERSHIPS</h2></div><button className="link" onClick={()=>go('squads')}>VIEW ALL →</button></div>{['CodeSphere Global Hackathon','Executors Esports','Algorithmic Trading Society'].map((name,i)=><div className="membership" key={name}><span className={`mini-icon ${['cyan','violet','green'][i]}`}>◈</span><div><b>{name}</b><small>{['Team Lead & Core Engine','Starting Mid-Laner (Roster A)','Research Contributor'][i]}</small></div><em>{['LIVE SPRINT','PLAYOFFS FRI','BACKTEST'][i]}</em></div>)}</div></div><div className="section-title"><div><p className="eyebrow">LATEST FIELD LOGS</p><h2>RECENT ACHIEVEMENTS</h2></div><button className="ghost" onClick={()=>go('activity')}>VIEW ACTIVITY →</button></div><Activity activities={activities.slice(0,2)}/></section> }
function Stat({label,value,color=''}) {return <div className={`stat ${color}`}><p>{label}</p><b>{value}</b><span>▲ +{color==='cyan'?'4.2':'1'}% THIS TERM</span></div>}
function Metric({label,value,color}) {return <div className="metric"><span>{label}</span><div className="segmented"><i className={color} style={{width:`${value}%`}}/></div><b>{value}</b></div>}
function Activity({activities}) {return <section className="activity-list">{activities.map(a=><article className={`activity ${a.accent}`} key={a.id}><div><p className="activity-cat">{a.category} <span>✓ VERIFIED</span> <time>{a.time}</time></p><h3>{a.title}</h3><p>{a.description}</p></div><strong>+{a.xp} XP<small>AWARDED</small></strong></article>)}</section>}
function Squads(){return <section className="view"><p className="eyebrow cyan-text">SOCIAL NETWORK // 03 ACTIVE</p><h1>MEMBERSHIPS &<br/><span>SQUADS.</span></h1><div className="squad-grid">{[['EXECUTORS ESPORTS','Violet League Division','8 / 10 members','PLAYOFFS FRIDAY','violet'],['OPEN SOURCE GUILD','Campus maintainers collective','42 members','NEW ISSUE TRIAGE','cyan'],['WOMEN IN STEM SOCIETY','Build, mentor, rise together','128 members','MENTOR NIGHT · THU','amber']].map(([title,sub,members,event,color])=><div className={`squad ${color}`} key={title}><span className="guild-icon">⬡</span><p className="eyebrow">ACTIVE GUILD</p><h2>{title}</h2><p>{sub}</p><div><span>◉ {members}</span><b>{event}</b></div><button className="ghost">ENTER COMMAND HUB →</button></div>)}</div><div className="panel roster"><div className="panel-header"><div><p className="eyebrow">SIMILAR OPERATIVES</p><h2>YOUR PARTY MAY ALSO LIKE</h2></div></div>{['Liam Chen','Devon Reed','Maya Lin','Tariq Hassan'].map((x,i)=><div className="roster-item" key={x}><span className={`avatar ${['green','cyan','amber','violet'][i]}`}>{x.split(' ').map(v=>v[0]).join('')}</span><b>{x}</b><small>LVL {21+i*3} · {['Open Source','Robotics','Design Guild','Esports'][i]}</small><button className="ghost">CONNECT</button></div>)}</div></section>}
function Guild(){return <section className="view"><p className="eyebrow violet-text">GUILD COMMAND // EXECUTORS ESPORTS</p><h1>COMMAND<br/><span>HUB.</span></h1><div className="command"><div><p className="eyebrow">NEXT OPERATION</p><h2>VALORANT PLAYOFFS</h2><p>Friday, 19:00 · Arena B · Inter-collegiate quarterfinals</p><button className="primary">CONFIRM READY STATUS</button></div><div className="bracket"><b>2D 08H</b><span>UNTIL MATCH START</span><div>EXECUTORS <i>VS</i> NOVA</div></div></div><div className="panel roster"><div className="panel-header"><div><p className="eyebrow">ROSTER TELEMETRY</p><h2>ACTIVE MEMBERS</h2></div><span className="online">● 8 ONLINE</span></div>{['Elena Rostova','Kai Takahashi','Liam Chen','Alex Mercer','Marcus Vance'].map((x,i)=><div className="roster-item" key={x}><span className="avatar violet">{x.split(' ').map(v=>v[0]).join('')}</span><b>{x}</b><small>{['MID · SHOTCALLER','CAPTAIN · DUELIST','SENTINEL','CONTROLLER','INITIATOR'][i]}</small><em className="ready">● READY</em></div>)}</div></section>}
function Scanner({domain,setDomain,query,setQuery,students}) {return <section className="view"><p className="eyebrow violet-text">DEEP SEARCH PROTOCOL</p><h1>ADVANCED<br/><span>SCANNER.</span></h1><div className="scanner"><div className="filter-box"><p className="eyebrow">SCAN PARAMETERS</p><label>KEYWORD<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. AI, Valorant, Design"/></label><label>PRIMARY DOMAIN<select value={domain} onChange={e=>setDomain(e.target.value)}>{domains.map(d=><option key={d}>{d}</option>)}</select></label><label>LEVEL RANGE<input type="range" min="1" max="50" defaultValue="28"/></label><button className="primary">RUN SCAN →</button></div><div><div className="panel-header"><div><p className="eyebrow">SCAN RESULTS</p><h2>{students.length} OPERATIVES DETECTED</h2></div></div><div className="student-grid compact">{students.map(s=><StudentCard key={s.id} student={s} onClick={()=>{}}/>)}</div></div></div></section>}
function Privacy({privacy,updatePrivacy}) {return <section className="view"><p className="eyebrow cyan-text">SECURITY LAYER // FERPA PROTECTED</p><h1>PRIVACY &<br/><span>VISIBILITY.</span></h1><p className="intro">Control which parts of your campus journey can be seen by your fellow operatives.</p><div className="privacy-stack"><PrivacyItem title="Character sheet visibility" text="Who can inspect your level, accolades and academic stats?" value={privacy.profile} options={['Campus','Connections','Only me']} change={v=>updatePrivacy({profile:v})}/><PrivacyItem title="Activity feed visibility" text="Who can see achievements and activity logs you publish?" value={privacy.activity} options={['Campus','Connections','Only me']} change={v=>updatePrivacy({activity:v})}/><div className="privacy-item"><div><h2>Show squad memberships</h2><p>Let others find you through the guilds and squads you join.</p></div><button onClick={()=>updatePrivacy({squads:!privacy.squads})} className={`toggle ${privacy.squads?'on':''}`}><i/></button></div></div></section>}
function PrivacyItem({title,text,value,options,change}) {return <div className="privacy-item"><div><h2>{title}</h2><p>{text}</p></div><select value={value} onChange={e=>change(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></div>}
function ActivityModal({close,submit}) {return <div className="modal-wrap"><form className="modal" onSubmit={submit}><button type="button" className="close" onClick={close}>×</button><p className="eyebrow cyan-text">NEW FIELD LOG</p><h2>LOG AN ACHIEVEMENT</h2><label>TITLE<input name="title" required placeholder="What did you accomplish?"/></label><label>DETAILS<textarea name="description" required placeholder="Share a brief debrief..."/></label><div className="form-row"><label>CATEGORY<select name="category"><option>ACADEMICS // FIELD LOG</option><option>ESPORTS // FIELD LOG</option><option>CAMPUS // FIELD LOG</option></select></label><label>XP<input name="xp" type="number" defaultValue="50" min="1"/></label></div><button className="primary" type="submit">PUBLISH ACTIVITY →</button></form></div>}
export default App
