import { useState } from 'react'

export default function LoginPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true); setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
    const data = await response.json().catch(() => ({ error: 'Could not reach the server.' }))
    setLoading(false)
    if (!response.ok) return setError(data.error || 'Something went wrong.')
    localStorage.setItem('campus-pulse-token', data.token)
    localStorage.setItem('campus-pulse-user', JSON.stringify(data.user))
    onAuthenticated(data.user)
  }

  const demoLogin = async () => {
    setLoading(true); setError('')
    const response = await fetch('/api/auth/demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) })
    const data = await response.json().catch(() => ({ error: 'Could not reach the server.' }))
    setLoading(false)
    if (!response.ok) return setError(data.error || 'Could not start demo mode.')
    localStorage.setItem('campus-pulse-token', data.token)
    localStorage.setItem('campus-pulse-user', JSON.stringify(data.user))
    onAuthenticated(data.user)
  }

  return <div className="login-page">
    <section className="login-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="login-brand"><span className="crest">⚡</span><div><b>CAMPUS PULSE</b><small>RPG HUD // SYS.02</small></div></div><div className="art-copy"><p className="eyebrow cyan-text">CAMPUS OPERATING SYSTEM</p><h1>YOUR CAMPUS.<br/><span>YOUR QUEST.</span></h1><p>Build your party, log victories, and level up every part of student life.</p><div className="telemetry"><span>◉ VERIFIED CAMPUS NETWORK</span><span>◈ 2,400+ OPERATIVES ONLINE</span></div></div><p className="art-footer">FERPA SECURED // CAMPUS PULSE NETWORK</p></section>
    <section className="login-panel"><div className="login-card"><p className="eyebrow cyan-text">{mode === 'login' ? 'IDENTITY VERIFICATION' : 'INITIALIZE OPERATIVE PROFILE'}</p><h2>{mode === 'login' ? 'WELCOME BACK.' : 'JOIN THE PARTY.'}</h2><div className="role-tabs"><button className={role === 'student' ? 'selected' : ''} onClick={() => setRole('student')}>STUDENT</button><button className={role === 'admin' ? 'selected' : ''} onClick={() => setRole('admin')}>ADMIN</button></div><p className="login-sub">{role === 'admin' ? 'Campus operations access: deploy and manage events.' : 'Sign in to access your campus command center.'}</p>{mode === 'login' && <button className="demo-login" onClick={demoLogin} disabled={loading}>⚡ ENTER {role === 'admin' ? 'ADMIN' : 'STUDENT'} DEMO</button>}<div className="login-divider"><span>OR USE YOUR ACCOUNT</span></div><form onSubmit={submit}>{mode === 'register' && <label>DISPLAY NAME<input name="name" required minLength="2" placeholder="Elena Rostova"/></label>}<label>CAMPUS EMAIL<input name="email" type="email" required placeholder="you@university.edu"/></label><label>PASSWORD<input name="password" type="password" required minLength="8" placeholder="Minimum 8 characters"/></label>{error && <p className="auth-error">⚠ {error}</p>}<button className="primary login-submit" disabled={loading}>{loading ? 'CONNECTING...' : mode === 'login' ? 'ENTER COMMAND CENTER →' : 'CREATE PROFILE →'}</button></form><div className="login-switch">{mode === 'login' ? 'New operative?' : 'Already enlisted?'} <button onClick={() => {setMode(mode === 'login' ? 'register' : 'login');setError('')}}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></div><p className="security-note">◈ Your credentials are encrypted and stored securely.</p></div></section>
  </div>
}
