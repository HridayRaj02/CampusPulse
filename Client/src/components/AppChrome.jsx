export function Topbar({ query, setQuery, go, openLogger }) {
  return <header className="topbar"><button className="brand" onClick={() => go('discover')}><span className="crest">⚡</span><span><b>CAMPUS PULSE</b><small>RPG HUD // SYS.02</small></span></button><div className="global-search">⌕ <input placeholder="Search stats, quests, guilds, or operatives..." value={query} onChange={e => { setQuery(e.target.value); go('discover') }}/><kbd>⌘K</kbd></div><div className="top-actions"><span className="online">● ONLINE // 14ms</span><button className="primary" onClick={openLogger}>＋ Log Activity</button><button className="icon">♧</button><button className="user" onClick={() => go('profile')}><span className="avatar cyan">ER</span><span><b>Elena Rostova</b><small>LVL 28 GRANDMASTER CODER</small></span></button></div></header>
}

export function Sidebar({ nav, page, go }) {
  return <aside className="sidebar"><div><p className="eyebrow">TACTICAL NAVIGATION</p>{nav.map(([id, icon, label]) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => go(id)}><span>{icon}</span>{label}</button>)}</div><div className="system"><p className="eyebrow">SYSTEM STATUS <i>●</i></p><span>SECTOR: MAIN CAMPUS<br/><em>// FERPA ENCRYPTED</em></span></div></aside>
}
