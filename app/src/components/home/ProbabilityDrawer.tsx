'use client'
import { useState } from 'react'
import type { WCMatch } from '@/lib/types'

type Tab = '1x2' | 'score'
type View = 'model' | 'market' | 'edge'

const C = {
  a: '#3b82d6', draw: '#8b93a1', b: '#3ddc97',
  pos: '#3ddc97', neg: '#ff8a7a',
  panel: '#0c1016', line: '#232a33', sub: '#9aa3b0', dim: '#6b7280',
}

function Segment({ label, value, market, view, color }: {
  label: string; value: number; market: number; view: View; color: string
}) {
  if (view === 'edge') {
    const d = value - market
    const col = d >= 0 ? C.pos : C.neg
    const w = Math.min(50, Math.abs(d) * 2.4)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 22 }}>
        <span className="al-mono" style={{ width: 46, fontSize: 11, color: '#cdd3dc' }}>{label}</span>
        <div style={{ flex: 1, position: 'relative', height: 8, background: '#161b22', borderRadius: 99 }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: C.line }} />
          <div style={{
            position: 'absolute', top: 0, bottom: 0, borderRadius: 99, background: col, opacity: .85,
            left: d >= 0 ? '50%' : `${50 - w}%`, width: `${w}%`,
          }} />
        </div>
        <span className="al-mono" style={{ width: 44, textAlign: 'right', fontSize: 11, color: col, fontWeight: 700 }}>
          {d >= 0 ? '+' : ''}{Math.round(d)}
        </span>
      </div>
    )
  }
  const v = view === 'model' ? value : market
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 22 }}>
      <span className="al-mono" style={{ width: 46, fontSize: 11, color: '#cdd3dc' }}>{label}</span>
      <div style={{ flex: 1, position: 'relative', height: 8, background: '#161b22', borderRadius: 99 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v}%`, background: color, borderRadius: 99 }} />
      </div>
      <span className="al-mono" style={{ width: 44, textAlign: 'right', fontSize: 11, color: '#fff', fontWeight: 600 }}>{v}%</span>
    </div>
  )
}

type SL = { home: number; away: number; prob: number }
function scoreEdgeRows(model?: SL[], market?: SL[]) {
  const m = new Map<string, number>(), k = new Map<string, number>()
  for (const s of model ?? []) m.set(`${s.home}-${s.away}`, s.prob)
  for (const s of market ?? []) k.set(`${s.home}-${s.away}`, s.prob)
  return [...new Set([...m.keys(), ...k.keys()])]
    .map(label => ({ label, d: (m.get(label) ?? 0) - (k.get(label) ?? 0) }))
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
    .slice(0, 7)
}

export function ProbabilityDrawer({ match, open }: { match: WCMatch; open: boolean }) {
  const [tab, setTab] = useState<Tab>('1x2')
  const [view, setView] = useState<View>('model')

  const sp = match.scoreProbs
  const live = match.status === 'live'
  const hasMarket = match.marketSource === 'polymarket'
  const marketScores = match.crowdScores

  const tabBtn = (t: Tab, label: string) => (
    <button onClick={() => setTab(t)} style={{
      background: tab === t ? 'rgba(91,80,216,.18)' : 'transparent',
      border: `1px solid ${tab === t ? 'rgba(91,80,216,.5)' : C.line}`,
      color: tab === t ? '#cfc8ff' : C.sub,
      fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 7, cursor: 'pointer',
      fontFamily: 'inherit',
    }}>{label}</button>
  )
  const viewBtn = (v: View, label: string) => (
    <button onClick={() => setView(v)} style={{
      background: view === v ? '#1d232b' : 'transparent',
      border: 'none', color: view === v ? '#fff' : C.dim,
      fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 6, cursor: 'pointer',
      fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '.04em',
    }}>{label}</button>
  )

  return (
    <div style={{
      maxHeight: open ? 460 : 0, opacity: open ? 1 : 0, overflow: 'hidden',
      transition: 'max-height .32s ease, opacity .25s ease', marginTop: open ? 8 : 0,
    }}>
      <div style={{
        border: `1px solid ${C.line}`, borderRadius: 14, background: C.panel,
        padding: '14px 18px', color: '#fff',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="al-mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: C.dim }}>
            Probabilités — <span style={{ color: '#cdd3dc' }}>{match.aCode} vs {match.bCode}</span>
          </div>
          {live && match.minute && (
            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#ff8a7a', background: 'rgba(220,81,71,.16)', border: '1px solid rgba(220,81,71,.4)', padding: '2px 8px', borderRadius: 99 }}>
              ● Live · {match.minute}
            </span>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 7 }}>{tabBtn('1x2', '1X2')}{tabBtn('score', 'Score exact')}</div>
          <div style={{ display: 'flex', gap: 2, background: '#0a0d12', border: `1px solid ${C.line}`, borderRadius: 8, padding: 2 }}>
            {viewBtn('model', 'Modèle')}{viewBtn('market', 'Marché')}{viewBtn('edge', 'Edge')}
          </div>
        </div>

        {/* 1X2 tab */}
        {tab === '1x2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Segment label={match.aCode} value={match.probA} market={match.crowdA} view={view} color={C.a} />
            <Segment label="Nul" value={match.probDraw} market={match.crowdDraw} view={view} color={C.draw} />
            <Segment label={match.bCode} value={match.probB} market={match.crowdB} view={view} color={C.b} />
            <div className="al-mono" style={{ fontSize: 9.5, color: C.dim, marginTop: 4 }}>
              {view === 'edge'
                ? 'Écart Modèle − Marché (points de %)'
                : view === 'market'
                  ? `Marché : ${hasMarket ? 'Polymarket' : 'consensus réputation (pas de marché Polymarket)'}`
                  : 'Modèle AlphaLens — Poisson sur la force des équipes'}
            </div>
          </div>
        )}

        {/* Score tab */}
        {tab === 'score' && (
          <div>
            {live && sp?.base && (
              <div className="al-mono" style={{ fontSize: 9.5, color: C.sub, marginBottom: 8 }}>
                Scores finaux probables · base {sp.base.home}-{sp.base.away} · buts restants modélisés
              </div>
            )}
            {(view === 'market' || view === 'edge') && !marketScores ? (
              <div style={{ fontSize: 12, color: C.sub, padding: '14px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>ⓘ</span>
                Pas de marché correct-score sur Polymarket pour ce match — vue disponible en <b style={{ color: '#cdd3dc' }}>Modèle</b> uniquement.
              </div>
            ) : view === 'edge' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {scoreEdgeRows(sp?.scores, marketScores).map((r, i) => {
                  const col = r.d >= 0 ? C.pos : C.neg
                  const w = Math.min(50, Math.abs(r.d) * 3)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 20 }}>
                      <span className="al-mono" style={{ width: 40, fontSize: 12, color: '#cdd3dc' }}>{r.label}</span>
                      <div style={{ flex: 1, position: 'relative', height: 8, background: '#161b22', borderRadius: 99 }}>
                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: C.line }} />
                        <div style={{ position: 'absolute', top: 0, bottom: 0, borderRadius: 99, background: col, opacity: .85, left: r.d >= 0 ? '50%' : `${50 - w}%`, width: `${w}%` }} />
                      </div>
                      <span className="al-mono" style={{ width: 44, textAlign: 'right', fontSize: 11, color: col, fontWeight: 700 }}>{r.d >= 0 ? '+' : ''}{r.d.toFixed(1)}</span>
                    </div>
                  )
                })}
                <div className="al-mono" style={{ fontSize: 9.5, color: C.dim, marginTop: 4 }}>Modèle − Marché (points de %) · par score</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(() => {
                  const rows = view === 'market' ? (marketScores ?? []) : (sp?.scores ?? [])
                  const max = rows[0]?.prob || 1
                  return rows.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 20 }}>
                      <span className="al-mono" style={{ width: 40, fontSize: 12, color: i === 0 ? '#fff' : '#cdd3dc', fontWeight: i === 0 ? 700 : 500 }}>
                        {s.home}-{s.away}
                      </span>
                      <div style={{ flex: 1, height: 8, background: '#161b22', borderRadius: 99 }}>
                        <div style={{ width: `${(s.prob / max) * 100}%`, height: '100%', background: i === 0 ? C.b : (view === 'market' ? '#8b93a1' : C.a), opacity: i === 0 ? 1 : .7, borderRadius: 99 }} />
                      </div>
                      <span className="al-mono" style={{ width: 44, textAlign: 'right', fontSize: 11, color: '#fff', fontWeight: 600 }}>{s.prob}%</span>
                    </div>
                  ))
                })()}
                <div className="al-mono" style={{ fontSize: 9.5, color: C.dim, marginTop: 4 }}>
                  {view === 'market'
                    ? 'Marché Polymarket · probabilités implicites correct-score'
                    : `Modèle AlphaLens · λ ${sp?.lambdaHome} − ${sp?.lambdaAway} buts attendus${hasMarket ? '' : ' · pas de marché Polymarket'}`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
