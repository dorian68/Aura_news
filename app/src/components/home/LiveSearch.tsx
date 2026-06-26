'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Hit {
  id: string; question: string; yesPct: number; vol: string; closes: string
  delta: number; up: boolean; category: string; catCol: string; spark: number[]
}
type Driver = { label: string; w: string; col: string; tag: string }
type Read = { question: string; pctLabel: string; vol: string; liq: string; fairLabel: string; edge: string; spark: string }
type Source = { tag: string; name: string; t: string }
type Seg =
  | { t: 'text'; text: string }
  | { t: 'drivers'; drivers: Driver[] }
  | { t: 'read'; read: Read }
  | { t: 'sources'; sources: Source[] }
  | { t: 'follow'; chips: string[] }
interface Turn { user: string; segs: Seg[]; thinking: boolean; done: boolean }

const sparkPts = (arr: number[], w: number, h: number) => {
  const mn = Math.min(...arr), mx = Math.max(...arr), r = (mx - mn) || 1
  return arr.map((v, i) => `${(i / (arr.length - 1) * w).toFixed(1)},${(h - ((v - mn) / r) * h).toFixed(1)}`).join(' ')
}

export function LiveSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [igniting, setIgniting] = useState(false)
  const [hits, setHits] = useState<Hit[]>([])
  const [trending, setTrending] = useState<Hit[]>([])
  const [chat, setChat] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [composer, setComposer] = useState('')
  const [, force] = useState(0)
  const reveal = useRef<{ seg: number; char: number }>({ seg: 0, char: 0 })
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)
  const demo = useRef<ReturnType<typeof setInterval> | null>(null)
  const igniteT = useRef<ReturnType<typeof setTimeout> | null>(null)

  // trending (3 cards + default dropdown)
  useEffect(() => { fetch('/api/markets/search?q=').then(r => r.json()).then(setTrending).catch(() => {}) }, [])

  // debounced autocomplete
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/markets/search?q=${encodeURIComponent(query)}`).then(r => r.json()).then(setHits).catch(() => {})
    }, 180)
    return () => clearTimeout(t)
  }, [query])

  const suggestions = (query.trim() ? hits : trending).slice(0, 5)
  const ghost = (() => {
    const q = query
    if (!q) return ''
    const hit = suggestions.find(s => s.question.toLowerCase().startsWith(q.toLowerCase()))
    return hit ? hit.question.slice(q.length) : ''
  })()
  const dropTitle = query.trim() ? (hits.length ? 'Predicted markets' : 'Closest reads') : 'Trending now'

  // ── chat reveal engine ──
  const startTick = useCallback(() => {
    if (tick.current) clearInterval(tick.current)
    tick.current = setInterval(() => {
      setTurns(prev => {
        const t = [...prev]; const last = t[t.length - 1]
        if (!last || last.done) { if (tick.current) clearInterval(tick.current); return prev }
        const r = reveal.current; const seg = last.segs[r.seg]
        if (!seg) { last.done = true }
        else if (seg.t === 'text') { if (r.char < seg.text.length) r.char = Math.min(seg.text.length, r.char + 2); else { r.seg++; r.char = 0 } }
        else { if (r.char < 6) r.char++; else { r.seg++; r.char = 0 } }
        if (r.seg >= last.segs.length) last.done = true
        return t
      })
      force(x => x + 1)
    }, 24)
  }, [])

  const ask = useCallback(async (q: string) => {
    const question = q.trim(); if (!question) return
    setIgniting(false); setChat(true); setFocused(false); setQuery('')
    setTurns(prev => [...prev, { user: question, segs: [], thinking: true, done: false }])
    try {
      const res = await fetch('/api/market-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: question }) })
      const d = await res.json()
      const segs: Seg[] = []
      if (d.intro) segs.push({ t: 'text', text: d.intro })
      if (d.drivers?.length) segs.push({ t: 'drivers', drivers: d.drivers })
      if (d.edgeNote) segs.push({ t: 'text', text: d.edgeNote })
      if (d.read) segs.push({ t: 'read', read: d.read })
      if (d.sources?.length) segs.push({ t: 'sources', sources: d.sources })
      if (d.followups?.length) segs.push({ t: 'follow', chips: d.followups })
      reveal.current = { seg: 0, char: 0 }
      setTurns(prev => { const t = [...prev]; t[t.length - 1] = { ...t[t.length - 1], segs, thinking: false }; return t })
      startTick()
    } catch {
      setTurns(prev => { const t = [...prev]; t[t.length - 1] = { ...t[t.length - 1], thinking: false, done: true, segs: [{ t: 'text', text: 'Could not reach the market engine — try again.' }] }; return t })
    }
  }, [startTick])

  // ignite then ask
  const ignite = useCallback((q: string) => {
    setQuery(q); setIgniting(true); setFocused(false)
    if (igniteT.current) clearTimeout(igniteT.current)
    igniteT.current = setTimeout(() => ask(q), 720)
  }, [ask])

  const playDemo = () => {
    if (demo.current) clearInterval(demo.current)
    const target = trending[0]?.question || 'Will Bitcoin reach $150,000 by Dec 31, 2026?'
    const typed = target.split(' ').slice(0, 4).join(' ')
    let i = 0; setFocused(true); setQuery('')
    demo.current = setInterval(() => {
      i++; setQuery(typed.slice(0, i))
      if (i >= typed.length) { if (demo.current) clearInterval(demo.current); setTimeout(() => ignite(target), 650) }
    }, 80)
  }

  const newSearch = () => {
    if (tick.current) clearInterval(tick.current)
    setChat(false); setTurns([]); setQuery(''); setComposer(''); setIgniting(false)
  }

  useEffect(() => () => { if (tick.current) clearInterval(tick.current); if (demo.current) clearInterval(demo.current) }, [])

  const ST = `
    @keyframes als-glow{0%,100%{opacity:.55}50%{opacity:.95}}
    @keyframes als-spin{to{transform:rotate(360deg)}}
    @keyframes als-ring{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
    @keyframes als-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes als-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
    @keyframes als-dot{0%,70%,100%{transform:translateY(0);opacity:.3}35%{transform:translateY(-4px);opacity:1}}
    .als-row:hover{background:#f5f2fb !important}
    .als-chip{transition:background .14s,border-color .14s,transform .12s;cursor:pointer}
    .als-chip:hover{background:#efeefb !important;border-color:#cdc6f4 !important;transform:translateY(-1px)}
    .als-card{transition:transform .18s,box-shadow .18s,border-color .18s;cursor:pointer}
    .als-card:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(20,26,40,.12);border-color:#cfc7b5}
  `

  return (
    <div style={{ position: 'relative' }}>
      <style>{ST}</style>

      {/* ===== SEARCH BAR (our width: full container) ===== */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <div style={{ position: 'relative' }}>
          {igniting && (
            <div style={{ position: 'absolute', inset: -14, borderRadius: 26, overflow: 'hidden', pointerEvents: 'none', filter: 'blur(16px)', animation: 'als-glow 1.1s ease-in-out infinite' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1600, height: 1600, background: 'conic-gradient(from 0deg,#5b50d8,#2f9488,#d8b94a,#c43d34,#a99bff,#5b50d8)', animation: 'als-ring 1.15s linear infinite' }} />
            </div>
          )}
          <div style={{ position: 'relative', borderRadius: 17, padding: 2, overflow: 'hidden', background: igniting ? '#fff' : (focused ? '#cfc8f0' : '#e6e0d3'), boxShadow: '0 1px 2px rgba(20,26,40,.05),0 10px 30px rgba(20,26,40,.07)' }}>
            {igniting && <div style={{ position: 'absolute', top: '50%', left: '50%', width: 1600, height: 1600, background: 'conic-gradient(from 0deg,#5b50d8,#2f9488,#d8b94a,#c43d34,#a99bff,#5b50d8)', animation: 'als-ring 1.15s linear infinite' }} />}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, background: '#fff', borderRadius: 15, padding: '13px 13px 13px 18px' }}>
              <span style={{ color: '#5b50d8', fontSize: 18, lineHeight: 1, flex: 'none' }}>✦</span>
              <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 24 }}>
                <div aria-hidden className="al-serif" style={{ position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', alignItems: 'center', fontSize: 17, fontStyle: 'italic', whiteSpace: 'pre', pointerEvents: 'none', overflow: 'hidden', maxWidth: '100%' }}>
                  <span style={{ color: 'transparent' }}>{query}</span><span style={{ color: '#c2bbab' }}>{focused ? ghost : ''}</span>
                </div>
                <input
                  className="al-serif" value={query}
                  onChange={e => { setQuery(e.target.value); setFocused(true); setIgniting(false) }}
                  onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 180)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); ignite(suggestions[0]?.question || query) } if (e.key === 'Tab' && ghost) { e.preventDefault(); setQuery(query + ghost) } }}
                  placeholder="Ask AlphaLens about any market event…"
                  style={{ position: 'relative', width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 17, color: '#16181d', fontStyle: 'italic', padding: 0 }}
                />
              </div>
              <span className="al-mono" style={{ fontSize: 11, color: '#a39b8c', flex: 'none' }}>1 credit</span>
              <button className="btn btn-ai btn-sm" onClick={() => ignite(suggestions[0]?.question || query)} style={{ borderRadius: 11, flex: 'none', fontWeight: 700 }}>✦ Ask</button>
            </div>
          </div>

          {/* ===== DROPDOWN ===== */}
          {focused && !igniting && suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0, background: '#fff', border: '1px solid #e6e0d3', borderRadius: 16, boxShadow: '0 20px 50px rgba(20,26,40,.16)', overflow: 'hidden', animation: 'als-rise .22s ease both', zIndex: 30 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px 9px', borderBottom: '1px solid #f0ebe0' }}>
                <span className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8b93a1' }}>{dropTitle}</span>
                <span className="al-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#0f7d56' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#19c37d', display: 'inline-block', animation: 'als-glow 1.4s ease-in-out infinite' }} />Live pricing
                </span>
              </div>
              {suggestions.map(s => (
                <div key={s.id} className="als-row" onMouseDown={() => ignite(s.question)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: '1px solid #f4f0e7', cursor: 'pointer' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: s.catCol, flex: 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="al-serif" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25, color: '#1c2128', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.question}</div>
                    <div className="al-mono" style={{ fontSize: 10, color: '#9aa0ab', marginTop: 2 }}>{s.category} · {s.vol} vol{s.closes ? ` · ${s.closes}` : ''}</div>
                  </div>
                  <svg width="62" height="26" viewBox="0 0 62 26" style={{ flex: 'none', overflow: 'visible' }}><polyline points={sparkPts(s.spark, 60, 22)} fill="none" stroke={s.up ? '#0f7d56' : '#c43d34'} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
                  <div style={{ textAlign: 'right', flex: 'none', width: 62 }}>
                    <div className="al-mono" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1, color: '#16181d' }}>{s.yesPct}%</div>
                    <div className="al-mono" style={{ fontSize: 10, fontWeight: 600, color: s.up ? '#0f7d56' : '#c43d34', marginTop: 2 }}>{s.up ? '▲ +' : '▼ '}{Math.abs(s.delta)} pt</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', background: '#faf8f2' }}>
                <span className="al-mono" style={{ fontSize: 9.5, color: '#a39b8c' }}>↵ to ask · Tab to complete</span>
                <span className="al-mono" style={{ fontSize: 9.5, color: '#a39b8c' }}>Retrieval over live Polymarket</span>
              </div>
            </div>
          )}
        </div>

        {/* quick chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {trending.slice(0, 4).map(c => (
            <span key={c.id} className="als-chip al-mono" onClick={() => ignite(c.question)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, padding: '6px 12px', borderRadius: 999, background: '#fff', border: '1px solid #e6e0d3', color: '#59606e' }}>
              <span style={{ color: c.catCol }}>●</span>{c.question.replace(/^Will (the )?/, '').replace(/\?$/, '').slice(0, 32)}…
            </span>
          ))}
          <span className="als-chip al-mono" onClick={playDemo} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, padding: '6px 13px', borderRadius: 999, background: '#16181d', border: '1px solid #16181d', color: '#fff' }}>▶ Play the animation</span>
        </div>
      </div>

      {/* 3 desk cards */}
      {trending.length >= 3 && (
        <div style={{ marginTop: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span className="al-mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8b93a1' }}>Today on the desk · live</span>
            <div style={{ flex: 1, height: 1, background: '#d9d3c4' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {trending.slice(0, 3).map(d => (
              <div key={d.id} className="als-card" onClick={() => ignite(d.question)} style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '16px 17px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
                  <span className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: d.catCol }}>{d.category}</span>
                  <span className="al-mono" style={{ fontSize: 10, color: d.up ? '#0f7d56' : '#c43d34' }}>{d.up ? '▲ +' : '▼ '}{Math.abs(d.delta)} pt</span>
                </div>
                <div className="al-serif" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.28, marginBottom: 14, minHeight: 42 }}>{d.question}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <span className="al-mono" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{d.yesPct}%</span>
                  <span className="al-mono" style={{ fontSize: 10, color: '#9aa0ab' }}>{d.vol} vol</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== FULL-SCREEN CHAT ===== */}
      {chat && <ChatOverlay turns={turns} composer={composer} setComposer={setComposer} onNew={newSearch} onAsk={ask} reveal={reveal.current} />}
    </div>
  )
}

function ChatOverlay({ turns, composer, setComposer, onNew, onAsk, reveal }: {
  turns: Turn[]; composer: string; setComposer: (s: string) => void; onNew: () => void; onAsk: (q: string) => void
  reveal: { seg: number; char: number }
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: '#efeae0', display: 'flex', flexDirection: 'column', animation: 'als-rise .4s cubic-bezier(.2,.8,.25,1) both' }}>
      <div style={{ borderBottom: '1px solid #e0d9ca', background: 'rgba(239,234,224,.9)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '13px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <button className="btn btn-sm" onClick={onNew} style={{ background: 'transparent', color: '#59606e', paddingLeft: 0, cursor: 'pointer' }}>← New search</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', display: 'inline-block', animation: 'als-spin 8s linear infinite' }} />
            <span className="al-serif" style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>AlphaLens <span style={{ fontStyle: 'italic', fontWeight: 500 }}>AI</span></span>
          </div>
          <span className="al-mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5b50d8', background: '#efeefb', border: '1px solid #ddd9f7', padding: '4px 9px', borderRadius: 999 }}>RAG · Polymarket</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '30px 24px' }}>
          {turns.map((m, ti) => (
            <div key={ti}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 26 }}>
                <div className="al-serif" style={{ maxWidth: '74%', background: '#16181d', color: '#fff', fontSize: 16, lineHeight: 1.4, padding: '12px 17px', borderRadius: '16px 16px 5px 16px' }}>{m.user}</div>
              </div>
              <div style={{ display: 'flex', gap: 13, marginBottom: 30 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>✦</span>
                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  {m.thinking ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, height: 30 }}>
                      <span style={{ display: 'inline-flex', gap: 4 }}>
                        {[0, 0.18, 0.36].map((d, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#5b50d8', display: 'block', animation: `als-dot 1.1s ${d}s infinite` }} />)}
                      </span>
                      <span className="al-mono" style={{ fontSize: 11, color: '#9aa0ab' }}>Retrieving live market data…</span>
                    </div>
                  ) : <Parts turn={m} isLast={ti === turns.length - 1} reveal={reveal} onFollow={onAsk} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e0d9ca', background: '#efeae0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e0d9ca', borderRadius: 14, padding: '11px 11px 11px 16px', boxShadow: '0 1px 2px rgba(20,26,40,.04)' }}>
            <span style={{ color: '#5b50d8', fontSize: 16, flex: 'none' }}>✦</span>
            <input className="al-serif" value={composer} onChange={e => setComposer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (composer.trim()) { onAsk(composer); setComposer('') } } }} placeholder="Ask a follow-up…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15.5, color: '#16181d', padding: 0 }} />
            <button className="btn btn-ai btn-sm" onClick={() => { if (composer.trim()) { onAsk(composer); setComposer('') } }} style={{ borderRadius: 10, flex: 'none' }}>Send</button>
          </div>
          <p className="al-mono" style={{ textAlign: 'center', fontSize: 10, color: '#a39b8c', margin: '9px 0 0' }}>Market % from Polymarket · fair value is AlphaLens&apos;s own · Research &amp; education only — not investment advice.</p>
        </div>
      </div>
    </div>
  )
}

function Parts({ turn, isLast, reveal, onFollow }: { turn: Turn; isLast: boolean; reveal: { seg: number; char: number }; onFollow: (q: string) => void }) {
  const out: React.ReactNode[] = []
  for (let i = 0; i < turn.segs.length; i++) {
    if (isLast && !turn.done && i > reveal.seg) break
    const seg = turn.segs[i]
    const isCur = isLast && !turn.done && i === reveal.seg
    if (seg.t === 'text') {
      const full = !isLast || turn.done || i < reveal.seg
      out.push(<p key={i} className="al-serif" style={{ fontSize: 16, lineHeight: 1.6, color: '#2a2f38', margin: '0 0 16px' }}>{full ? seg.text : seg.text.slice(0, reveal.char)}{isCur && <span style={{ display: 'inline-block', width: 8, height: 17, background: '#5b50d8', marginLeft: 2, verticalAlign: -2, animation: 'als-blink 1s steps(1) infinite' }} />}</p>)
    } else if (seg.t === 'drivers') {
      out.push(<div key={i} style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '15px 17px', margin: '0 0 16px', animation: 'als-rise .4s ease both' }}>
        <div className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8b93a1', marginBottom: 12 }}>What&apos;s moving the price</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{seg.drivers.map((dr, j) => (
          <div key={j}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}><span style={{ fontSize: 13.5, fontWeight: 600, color: '#2a2f38' }}>{dr.label}</span><span className="al-mono" style={{ fontSize: 11, color: dr.col }}>{dr.tag}</span></div>
            <div style={{ height: 6, borderRadius: 99, background: '#eee9dd', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: dr.w, background: dr.col, borderRadius: 99 }} /></div>
          </div>))}</div>
      </div>)
    } else if (seg.t === 'read') {
      const r = seg.read
      out.push(<div key={i} style={{ background: '#12171e', border: '1px solid #232a33', borderRadius: 16, padding: '18px 19px', margin: '0 0 16px', color: '#fff', position: 'relative', overflow: 'hidden', animation: 'als-rise .4s ease both' }}>
        <span style={{ position: 'absolute', top: -50, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(91,80,216,.4),transparent 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}><span className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a99bff' }}>AlphaLens read</span><span className="al-mono" style={{ fontSize: 10, color: '#6b7280' }}>{r.vol} vol</span></div>
        <div className="al-serif" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, marginBottom: 16, position: 'relative' }}>{r.question}</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', position: 'relative' }}>
          <div style={{ flex: 'none', textAlign: 'center' }}><div className="al-mono" style={{ fontSize: 38, fontWeight: 600, lineHeight: 1 }}>{r.pctLabel}</div><div className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b7280', marginTop: 4 }}>market YES</div></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', height: 9, borderRadius: 99, overflow: 'hidden', background: '#232a33', marginBottom: 10 }}><span style={{ width: r.pctLabel, background: 'linear-gradient(90deg,#5b50d8,#2f9488)' }} /></div>
            <svg width="100%" height="40" viewBox="0 0 240 40" preserveAspectRatio="none" style={{ display: 'block' }}><polyline points={r.spark} fill="none" stroke="#a99bff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
          </div>
          <div style={{ flex: 'none', borderLeft: '1px solid #232a33', paddingLeft: 18 }}><div className="al-mono" style={{ fontSize: 9, letterSpacing: '.07em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 4 }}>AlphaLens fair value</div><div className="al-mono" style={{ fontSize: 22, fontWeight: 600, color: '#3ddc97', lineHeight: 1 }}>{r.fairLabel}</div><div className="al-mono" style={{ fontSize: 10, color: '#8b93a1', marginTop: 5 }}>{r.edge} vs crowd</div></div>
        </div>
      </div>)
    } else if (seg.t === 'sources') {
      out.push(<div key={i} style={{ margin: '0 0 16px', animation: 'als-rise .4s ease both' }}>
        <div className="al-mono" style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8b93a1', marginBottom: 9 }}>Retrieved sources</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{seg.sources.map((sr, j) => <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, padding: '6px 11px', borderRadius: 9, background: '#fff', border: '1px solid #e6e0d3', color: '#3b414c' }}><span className="al-mono" style={{ fontSize: 9, color: '#5b50d8', fontWeight: 600 }}>{sr.tag}</span>{sr.name}<span className="al-mono" style={{ fontSize: 9.5, color: '#a39b8c' }}>{sr.t}</span></span>)}</div>
      </div>)
    } else if (seg.t === 'follow') {
      out.push(<div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '2px 0 0', animation: 'als-rise .4s ease both' }}>{seg.chips.map((fc, j) => <span key={j} className="als-chip al-serif" onClick={() => onFollow(fc)} style={{ fontSize: 13.5, padding: '8px 14px', borderRadius: 10, background: '#efeefb', border: '1px solid #ddd9f7', color: '#4a40c0', fontWeight: 500, cursor: 'pointer' }}>{fc}</span>)}</div>)
    }
  }
  return <>{out}</>
}
