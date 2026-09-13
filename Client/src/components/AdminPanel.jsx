import { useEffect, useState } from 'react'

export default function AdminPanel() {
  const [events, setEvents] = useState([])
  const [message, setMessage] = useState('')
  const token = localStorage.getItem('campus-pulse-token')

  const load = () => fetch('/api/events').then(r => r.json()).then(data => setEvents(data.events || []))
  useEffect(() => { load().catch(() => setMessage('Unable to load events.')) }, [])
  const createEvent = async (event) => {
    event.preventDefault()
    const response = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error)
    event.currentTarget.reset(); setEvents([data.event, ...events]); setMessage('Event published to the campus radar.')
  }

  return <section className="view admin-view"><p className="eyebrow amber-text">ADMINISTRATOR // CAMPUS OPERATIONS</p><h1>ADMIN<br/><span>COMMAND.</span></h1><p className="intro">Create campus events, manage their visibility, and monitor the current event queue.</p><div className="admin-grid"><form className="panel event-form" onSubmit={createEvent}><div className="panel-header"><div><p className="eyebrow">NEW CAMPUS EVENT</p><h2>DEPLOY EVENT</h2></div></div><label>EVENT TITLE<input name="title" required placeholder="e.g. Robotics Open House"/></label><div className="form-row"><label>CATEGORY<select name="category" defaultValue="Hackathon"><option>Hackathon</option><option>Esports</option><option>Workshop</option><option>Campus Life</option></select></label><label>DATE & TIME<input name="date" required placeholder="Oct 25 · 14:00"/></label></div><label>LOCATION<input name="location" required placeholder="Innovation Lab"/></label><label>BRIEFING<textarea name="description" required placeholder="What should students know?"/></label>{message && <p className="admin-message">✓ {message}</p>}<button className="primary">PUBLISH TO RADAR →</button></form><div className="panel"><div className="panel-header"><div><p className="eyebrow">LIVE EVENT QUEUE</p><h2>{events.length} DEPLOYED EVENTS</h2></div><span className="online">● SYNCED</span></div><div className="event-list">{events.map(event => <article className="event-item" key={event._id}><div><p>{event.category} // {event.date}</p><h3>{event.title}</h3><small>{event.location}</small><span>{event.description}</span></div><b>LIVE</b></article>)}</div></div></div></section>
}
