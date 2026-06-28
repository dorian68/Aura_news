'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// AgentDock AG-UI — assistant moderne branché sur /api/ag-ui/run (SSE).
// Landing à suggestions, animation "thinking", streaming des deltas, bulles
// user/assistant (DA NYT crème/encre), affichage des appels d'outils réels.

type Tool = { name: string; done: boolean }
type Msg = { role: 'user' | 'assistant'; content: string; tools?: Tool[] }

const SUGGESTIONS = [
  'Que pricent les marchés sur la prochaine décision de la Fed ?',
  'Donne-moi le snapshot macro actuel.',
  'Quels marchés sont liés à Bitcoin ?',
  'Les news tech du jour et ce que ça implique.',
]

const TOOL_LABEL: Record<string, string> = {
  search_markets: 'Recherche des marchés', get_news: 'Lecture des news',
  get_quotes: 'Cotations en direct', get_macro_snapshot: 'Snapshot macro',
}

export function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, thinking])
  // Deep-link : ouvre l'assistant si l'URL contient #assistant.
  useEffect(() => { if (typeof window !== 'undefined' && window.location.hash === '#assistant') setOpen(true) }, [])

  const send = useCallback(async (text: string) => {
    const q = text.trim()
    if (!q || running) return
    setInput('')
    const history: Msg[] = [...messages, { role: 'user', content: q }]
    setMessages([...history, { role: 'assistant', content: '', tools: [] }])
    setRunning(true); setThinking(true)
    const update = (fn: (m: Msg) => Msg) => setMessages(prev => { const c = [...prev]; c[c.length - 1] = fn(c[c.length - 1]); return c })
    try {
      const res = await fetch('/api/ag-ui/run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
      })
      if (!res.ok || !res.body) throw new Error('no stream')
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ''
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        buf += dec.decode(value, { stream: true }); const parts = buf.split('\n\n'); buf = parts.pop() || ''
        for (const p of parts) {
          const line = p.split('\n').find(l => l.startsWith('data:')); if (!line) continue
          let ev: { type?: string; toolCallName?: string; delta?: string }
          try { ev = JSON.parse(line.slice(5).trim()) } catch { continue }
          if (ev.type === 'ToolCallStart') update(m => ({ ...m, tools: [...(m.tools || []), { name: ev.toolCallName || '', done: false }] }))
          else if (ev.type === 'ToolCallResult') update(m => ({ ...m, tools: (m.tools || []).map((t, i, a) => i === a.findIndex(x => !x.done) ? { ...t, done: true } : t) }))
          else if (ev.type === 'TextMessageContent') { setThinking(false); update(m => ({ ...m, content: m.content + (ev.delta || '') })) }
          else if (ev.type === 'RunError') { setThinking(false); update(m => ({ ...m, content: m.content || 'Désolé, une erreur est survenue. Réessaie.' })) }
        }
      }
    } catch {
      update(m => ({ ...m, content: m.content || 'Connexion interrompue. Réessaie.' }))
    } finally { setRunning(false); setThinking(false) }
  }, [messages, running])

  const empty = messages.length === 0

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {open && (
        <div style={{ width: 380, maxWidth: 'calc(100vw - 32px)', height: 560, maxHeight: 'calc(100vh - 120px)', background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, boxShadow: '0 24px 60px rgba(20,26,40,.22)', marginBottom: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'al-rise .2s ease both' }}>
          {/* Header */}
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #f0ece1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f4ec' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', animation: 'al-orbspin 7s linear infinite' }}>✦</span>
              <div>
                <div className="al-serif" style={{ fontSize: 14.5, fontWeight: 700, color: '#16181d', lineHeight: 1.1 }}>AlphaLens AI</div>
                <div className="al-mono" style={{ fontSize: 9.5, color: '#8b93a1' }}>grounded in real markets</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {messages.length > 0 && <button onClick={() => setMessages([])} title="Nouvelle conversation" style={{ background: 'none', border: 'none', color: '#8b93a1', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: 4 }}>✎</button>}
              <button onClick={() => setOpen(false)} aria-label="Fermer" style={{ background: 'none', border: 'none', color: '#8b93a1', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: 4 }}>✕</button>
            </div>
          </div>

          {/* Messages / landing */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 6px' }}>
            {empty ? (
              <div>
                <p className="al-serif" style={{ fontSize: 15.5, lineHeight: 1.5, color: '#2b2f37', margin: '4px 0 14px' }}>
                  Bonjour — je relie l&apos;actualité aux marchés réels et à ton portefeuille. Que veux-tu explorer ?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} onClick={() => send(s)} className="al-card-hover" style={{ textAlign: 'left', background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#3b414c', cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.35 }}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {m.role === 'user' ? (
                      <div style={{ maxWidth: '82%', background: '#eef1fb', color: '#2b2f37', fontSize: 14, lineHeight: 1.45, padding: '9px 13px', borderRadius: '14px 14px 4px 14px', border: '1px solid #dcd9f6' }}>{m.content}</div>
                    ) : (
                      <div style={{ maxWidth: '92%' }}>
                        {m.tools && m.tools.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 7 }}>
                            {m.tools.map((t, j) => (
                              <span key={j} className="al-mono" style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: t.done ? '#e7f3ec' : '#f1effb', color: t.done ? '#0f7d56' : '#5b50d8', border: `1px solid ${t.done ? '#bfe3cd' : '#ddd9f7'}` }}>
                                {t.done ? '✓' : '◷'} {TOOL_LABEL[t.name] || t.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {m.content
                          ? m.content.split(/\n\s*\n+/).filter(Boolean).map((para, k) => (
                            <p key={k} className="al-serif" style={{ fontSize: 14.5, lineHeight: 1.55, color: '#2b2f37', margin: '0 0 8px' }}>{para}</p>
                          ))
                          : thinking && i === messages.length - 1 && (
                            <div role="status" aria-label="L'assistant réfléchit" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
                              {[0, 0.18, 0.36].map((d, k) => <span key={k} style={{ width: 7, height: 7, borderRadius: '50%', background: '#5b50d8', animation: `al-dot 1.1s ${d}s infinite` }} />)}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #f0ece1' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: '#f3f0e8', borderRadius: 12, padding: '8px 8px 8px 12px' }}>
              <textarea
                value={input} rows={1}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
                placeholder="Demande une analyse, un marché, une news…"
                style={{ flex: 1, border: 'none', background: 'transparent', resize: 'none', outline: 'none', fontSize: 13.5, color: '#16181d', fontFamily: 'inherit', maxHeight: 90, lineHeight: 1.4 }}
              />
              <button onClick={() => send(input)} disabled={running || !input.trim()} className="btn btn-ai btn-sm" style={{ flex: 'none', fontWeight: 700, opacity: running || !input.trim() ? 0.5 : 1 }}>↑</button>
            </div>
          </div>
        </div>
      )}

      <button
        className="al-bubble"
        style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, #5b50d8, #2469a6)', boxShadow: '0 8px 28px rgba(91,80,216,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Fermer AlphaLens AI' : 'Ouvrir AlphaLens AI'}
      >
        <span style={{ color: '#fff', fontSize: 22, lineHeight: 1 }}>{open ? '✕' : '✦'}</span>
      </button>
    </div>
  )
}
