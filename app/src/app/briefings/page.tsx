'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { TokenMeter } from '@/components/ui/TokenMeter'
import type { TradeReport } from '@/lib/generation/trade-prompt'

interface Digest { id: string; title: string; dateLabel: string; signals: TradeReport[] }

const DIR: Record<string, { c: string; a: string }> = {
  up: { c: '#0f7d56', a: '▲' }, down: { c: '#c43d34', a: '▼' }, neutral: { c: '#8b93a1', a: '→' },
}

export default function BriefingsPage() {
  const { addTokenUsage } = useAppStore()
  const router = useRouter()
  const [digest, setDigest] = useState<Digest | null>(null)
  const [status, setStatus] = useState('Pulling today’s feed…')
  const [progress, setProgress] = useState(8)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  const generate = useCallback(async () => {
    setDigest(null); setError(null); setProgress(8); setStatus('Pulling today’s feed…')
    try {
      const res = await fetch('/api/generate-digest', { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = '', ev = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('event: ')) ev = line.slice(7).trim()
          else if (line.startsWith('data: ') && ev) {
            try {
              const d = JSON.parse(line.slice(6))
              if (ev === 'status') { setProgress(d.pct); setStatus(d.step) }
              else if (ev === 'usage') addTokenUsage(d.input || 0, d.output || 0)
              else if (ev === 'complete') setDigest(d.digest as Digest)
              else if (ev === 'error') setError(d.message)
            } catch { /* ignore */ }
            ev = ''
          }
        }
      }
    } catch (err) { setError(`Generation failed: ${String(err)}`) }
  }, [addTokenUsage])

  useEffect(() => {
    if (started.current) return
    started.current = true
    generate()
  }, [generate])

  return (
    <div style={{ minHeight: '100vh', background: '#efeae0', color: '#16181d' }}>
      <div style={{ borderBottom: '1px solid #ded7c7', background: '#f7f4ec' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#16181d', fontSize: 13, fontWeight: 600 }}>← AlphaLens Daily</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <TokenMeter />
            <button className="btn btn-sm btn-ai" onClick={generate} disabled={!digest && !error} style={{ fontWeight: 700 }}>↻ Regenerate</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '34px 28px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="al-mono" style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: '#5b50d8', marginBottom: 8 }}>✦ AlphaLens Briefings</div>
          <h1 className="al-serif" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 6px' }}>
            {digest ? digest.title : 'Today’s signals'}
          </h1>
          {digest && <p className="al-mono" style={{ fontSize: 11, color: '#8b93a1' }}>{digest.dateLabel} · a digest of {digest.signals.length} grounded signals</p>}
        </div>

        {error ? (
          <div style={{ background: '#fde8e8', border: '1px solid #f3c8c8', borderRadius: 14, padding: 22, textAlign: 'center' }}>
            <p style={{ color: '#c43d34', fontSize: 14, margin: '0 0 14px' }}>{error}</p>
            <button className="btn btn-sm btn-ai" onClick={generate}>Try again</button>
          </div>
        ) : !digest ? (
          <Loader status={status} progress={progress} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 14 }}>
            {digest.signals.map(s => (
              <SignalCard key={s.id} s={s} onOpen={() => router.push(`/trade?news=${encodeURIComponent(s.newsId)}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SignalCard({ s, onOpen }: { s: TradeReport; onOpen: () => void }) {
  const topMarket = s.relatedMarkets[0]
  return (
    <div className="al-card-hover" onClick={onOpen} style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div className="al-mono" style={{ fontSize: 10, color: '#8b93a1', marginBottom: 7 }}>{s.newsSource}</div>
      <h3 className="al-serif" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.16, margin: '0 0 8px' }}>{s.headline}</h3>
      <p className="al-serif" style={{ fontSize: 14, lineHeight: 1.5, color: '#3b414c', margin: '0 0 13px', flex: 1 }}>{s.thesis}</p>

      {topMarket ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#f7f4ec', border: '1px solid #e6e0d3', borderRadius: 9, padding: '8px 11px', marginBottom: 11 }}>
          <span className="al-mono" style={{ fontSize: 16, fontWeight: 700, color: '#2469a6' }}>{topMarket.yesPct}%</span>
          <span className="al-serif" style={{ fontSize: 12.5, color: '#59606e', lineHeight: 1.3, flex: 1 }}>{topMarket.question}</span>
        </div>
      ) : (
        <div className="al-mono" style={{ fontSize: 10.5, color: '#a9a18f', marginBottom: 11 }}>ⓘ no direct market — asset read</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {s.assets.slice(0, 4).map((a, i) => {
          const d = DIR[a.direction] || DIR.neutral
          return (
            <span key={i} className="al-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, padding: '2px 7px', borderRadius: 6, background: a.inWatchlist ? '#eef1fb' : '#f3f0e8', border: `1px solid ${a.inWatchlist ? '#dcd9f6' : '#e6e0d3'}`, color: '#59606e' }}>
              {a.sym} <span style={{ color: d.c, fontWeight: 700 }}>{d.a}</span>
            </span>
          )
        })}
        <span className="al-link-hover" style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#5b50d8' }}>Open signal →</span>
      </div>
    </div>
  )
}

function Loader({ status, progress }: { status: string; progress: number }) {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 56, height: 56, margin: '0 auto 20px' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', animation: 'al-orb 2s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', background: '#efeae0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#5b50d8' }}>✦</div>
      </div>
      <div style={{ background: '#dcd5c6', borderRadius: 99, height: 5, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#5b50d8,#2469a6)', borderRadius: 99, transition: 'width .5s ease' }} />
      </div>
      <p className="al-mono" style={{ fontSize: 12, color: '#8b93a1' }}>{status}</p>
    </div>
  )
}
