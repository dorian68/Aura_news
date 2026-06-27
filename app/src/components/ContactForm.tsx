'use client'
import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #ded7c7', borderRadius: 9, padding: '10px 12px',
  fontSize: 14, fontFamily: 'inherit', background: '#fff', outline: 'none', color: '#16181d',
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setState('sending'); setErr('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) { setState('sent'); setName(''); setEmail(''); setMessage('') }
      else { setState('error'); setErr(data.error || 'Something went wrong. Please email us directly.') }
    } catch {
      setState('error'); setErr('Network error. Please email us directly.')
    }
  }

  if (state === 'sent') {
    return (
      <div style={{ background: '#e8f5ef', border: '1px solid #b9e0cd', borderRadius: 12, padding: '18px 20px' }}>
        <div className="al-serif" style={{ fontSize: 16, fontWeight: 700, color: '#0f7d56', marginBottom: 4 }}>Message sent ✓</div>
        <p style={{ fontSize: 14, color: '#3b414c', margin: 0 }}>Thanks for reaching out — we&apos;ll get back to you by email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label style={{ flex: 1, minWidth: 200, fontSize: 12.5, color: '#59606e' }}>
          Name
          <input style={{ ...inputStyle, marginTop: 5 }} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label style={{ flex: 1, minWidth: 200, fontSize: 12.5, color: '#59606e' }}>
          Email *
          <input required type="email" style={{ ...inputStyle, marginTop: 5 }} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
      </div>
      <label style={{ fontSize: 12.5, color: '#59606e' }}>
        Message *
        <textarea required rows={6} style={{ ...inputStyle, marginTop: 5, resize: 'vertical' }} value={message} onChange={e => setMessage(e.target.value)} placeholder="How can we help?" />
      </label>
      {state === 'error' && <p style={{ fontSize: 13, color: '#c43d34', margin: 0 }}>{err}</p>}
      <button type="submit" disabled={state === 'sending'} className="btn btn-ai" style={{ alignSelf: 'flex-start', fontWeight: 700, opacity: state === 'sending' ? 0.6 : 1 }}>
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
