'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

// AgentDock AG-UI — assistant moderne branché sur /api/ag-ui/run (SSE).
// Landing à suggestions, animation "thinking", streaming des deltas, bulles
// user/assistant (DA NYT crème/encre), affichage des appels d'outils réels.

type Tool = { name: string; done: boolean }
type Block = { tool: string; data: unknown }
type Msg = { role: 'user' | 'assistant'; content: string; tools?: Tool[]; blocks?: Block[] }

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

// Allowlist de UIBlocks rendus à partir des résultats d'outils réels (jamais de
// composant arbitraire généré par le modèle). Données réelles uniquement.
const S = (v: unknown) => String(v ?? '')
const N = (v: unknown) => (typeof v === 'number' ? v : Number(v)) || 0
const rowsOf = (d: unknown): Record<string, unknown>[] => (Array.isArray(d) ? (d as Record<string, unknown>[]) : [])

function AgentUIBlock({ block }: { block: Block }) {
  if (block.tool === 'search_markets') {
    const rows = rowsOf(block.data).slice(0, 3); if (!rows.length) return null
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, margin: '6px 0 2px' }}>
        {rows.map((r, i) => {
          const p = Math.max(0, Math.min(100, N(r.yesPct)))
          return (
            <div key={i} style={{ background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 9, padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span className="al-serif" style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.25 }}>{S(r.question)}</span>
                <span className="al-mono" style={{ fontSize: 13, fontWeight: 700, color: '#2469a6' }}>{N(r.yesPct)}%</span>
              </div>
              <div style={{ height: 5, background: '#eee8db', borderRadius: 99, marginTop: 6 }}><div style={{ width: `${p}%`, height: '100%', background: '#2469a6', borderRadius: 99 }} /></div>
              <div className="al-mono" style={{ fontSize: 9, color: '#a9a18f', marginTop: 4 }}>{S(r.category)} · {S(r.volume)} vol · Polymarket</div>
            </div>
          )
        })}
      </div>
    )
  }
  if (block.tool === 'get_macro_snapshot') {
    const rows = rowsOf(block.data); if (!rows.length) return null
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0 2px' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 8, padding: '5px 9px' }}>
            <div className="al-mono" style={{ fontSize: 8.5, color: '#8b93a1', textTransform: 'uppercase' }}>{S(r.label)}</div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
              <span className="al-mono" style={{ fontSize: 11.5, fontWeight: 700 }}>{N(r.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className="al-mono" style={{ fontSize: 10, fontWeight: 600, color: N(r.changePct) >= 0 ? '#0f7d56' : '#c43d34' }}>{N(r.changePct) >= 0 ? '+' : ''}{N(r.changePct).toFixed(2)}%</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (block.tool === 'get_quotes') {
    const rows = rowsOf(block.data); if (!rows.length) return null
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0 2px' }}>
        {rows.map((r, i) => (
          <span key={i} className="al-mono" style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 7, background: '#f7f4ec', border: '1px solid #e6e0d3' }}>
            <b>{S(r.sym)}</b> {N(r.price).toLocaleString(undefined, { maximumFractionDigits: 2 })} <span style={{ color: N(r.changePct) >= 0 ? '#0f7d56' : '#c43d34' }}>{N(r.changePct) >= 0 ? '+' : ''}{N(r.changePct).toFixed(2)}%</span>
          </span>
        ))}
      </div>
    )
  }
  if (block.tool === 'get_news') {
    const rows = rowsOf(block.data).slice(0, 3); if (!rows.length) return null
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '6px 0 2px' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ borderLeft: '2px solid #dcd9f6', paddingLeft: 8 }}>
            <div className="al-serif" style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.25 }}>{S(r.title)}</div>
            <div className="al-mono" style={{ fontSize: 9, color: '#a9a18f' }}>{S(r.source)} · {S(r.section)}</div>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages, thinking])
  // Deep-link : #assistant ouvre l'assistant ; ?ask=… auto-envoie la question.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hash !== '#assistant') return
    setOpen(true)
    const ask = new URLSearchParams(window.location.search).get('ask')
    if (ask) setTimeout(() => send(ask), 350)
  }, [])

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
          let ev: { type?: string; toolCallName?: string; delta?: string; content?: string }
          try { ev = JSON.parse(line.slice(5).trim()) } catch { continue }
          if (ev.type === 'ToolCallStart') update(m => ({ ...m, tools: [...(m.tools || []), { name: ev.toolCallName || '', done: false }] }))
          else if (ev.type === 'ToolCallResult') {
            let data: unknown = null
            try { data = JSON.parse(ev.content || 'null') } catch { /* ignore */ }
            update(m => {
              const tools = m.tools || []
              const idx = tools.findIndex(t => !t.done)
              const name = idx >= 0 ? tools[idx].name : ''
              return {
                ...m,
                tools: tools.map((t, i) => (i === idx ? { ...t, done: true } : t)),
                blocks: [...(m.blocks || []), { tool: name, data }],
              }
            })
          }
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
                        {m.blocks?.map((b, k) => <AgentUIBlock key={k} block={b} />)}
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
