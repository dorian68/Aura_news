'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { GeneratedReport } from '@/lib/generation/output-schema'
import { ANGLES } from '@/lib/generation/prompts'

interface Step {
  text: string
  pct: number
  done: boolean
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'radial-gradient(1200px 600px at 50% -10%,#f7f4ec,#e9e3d6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="al-mono" style={{ fontSize: 12, color: '#8b93a1' }}>Loading…</div>
      </div>
    }>
      <GenerateInner />
    </Suspense>
  )
}

function GenerateInner() {
  const params = useSearchParams()
  const router = useRouter()
  const newsId = params.get('news') || ''
  const angleId = params.get('angle') || 'macro'

  const { debitCredit, saveReport, setActiveReport, credits, addTokenUsage } = useAppStore()

  const [steps, setSteps] = useState<Step[]>([
    { text: 'Fetching article context…', pct: 5, done: false },
  ])
  const [consoleLines, setConsoleLines] = useState<string[]>(['› Initializing AlphaLens engine…'])
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(5)
  const consoleRef = useRef<HTMLDivElement>(null)

  const angle = ANGLES[angleId] || ANGLES.macro

  useEffect(() => {
    if (credits.count <= 0 && credits.plan !== 'power') {
      setError('No credits remaining. Please upgrade to continue.')
      return
    }
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addConsoleLine(text: string) {
    setConsoleLines(prev => [...prev, `› ${text}`])
    if (consoleRef.current) {
      setTimeout(() => {
        if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight
      }, 50)
    }
  }

  async function generate() {
    let article
    try {
      const res = await fetch('/api/news')
      const news = await res.json()
      article = news.find((n: { id: string }) => n.id === newsId) || news[0]
      addConsoleLine(`Article loaded: "${article?.title?.slice(0, 50)}…"`)
    } catch {
      setError('Failed to fetch article data.')
      return
    }

    const ok = debitCredit()
    if (!ok) { setError('Credit debit failed.'); return }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article, angleId }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let lastEvent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            lastEvent = line.slice(7).trim()
          } else if (line.startsWith('data: ') && lastEvent) {
            try {
              const data = JSON.parse(line.slice(6))
              handleEvent(lastEvent, data)
              lastEvent = ''
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(`Generation failed: ${String(err)}`)
    }
  }

  function handleEvent(type: string, data: Record<string, unknown>) {
    if (type === 'status') {
      const s = data as { step: string; pct: number }
      setProgress(s.pct)
      addConsoleLine(s.step)
      setSteps(prev => {
        const last = prev[prev.length - 1]
        if (last && !last.done) {
          return [...prev.slice(0, -1), { ...last, done: true }, { text: s.step, pct: s.pct, done: false }]
        }
        return [...prev, { text: s.step, pct: s.pct, done: false }]
      })
    }
    if (type === 'usage') {
      const u = data as { input: number; output: number }
      addTokenUsage(u.input || 0, u.output || 0)
      addConsoleLine(`Tokens — input ${u.input} · output ${u.output}`)
    }
    if (type === 'complete') {
      const report = data.report as GeneratedReport
      addConsoleLine('Report complete. Redirecting…')
      saveReport(report)
      setActiveReport(report)
      setTimeout(() => router.push(`/article/${report.id}`), 800)
    }
    if (type === 'error') {
      setError(data.message as string)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1200px 600px at 50% -10%,#f7f4ec,#e9e3d6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 540, animation: 'al-rise 0.4s ease both' }}>

        {/* Orb */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 62, height: 62, marginBottom: 18 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg,#5b50d8,#2469a6,#2f9488,#5b50d8)', animation: 'al-orb 2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', background: '#f3f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#5b50d8' }}>✦</div>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', color: '#16181d', textAlign: 'center' }}>
            Pricing this event
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#8b93a1', textAlign: 'center' }}>
            Angle: <span style={{ color: '#5b50d8', fontWeight: 600 }}>{angle.label}</span>
          </p>
        </div>

        {error ? (
          <div style={{ background: '#fde8e8', border: '1px solid #f3c8c8', borderRadius: 14, padding: 20, textAlign: 'center' }}>
            <p style={{ margin: '0 0 16px', color: '#c43d34', fontSize: 14 }}>{error}</p>
            <button className="btn btn-sm btn-ai" onClick={() => router.push('/')}>← Back to news</button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{ background: '#dcd5c6', borderRadius: 99, height: 5, marginBottom: 22, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#5b50d8,#2469a6)', borderRadius: 99, transition: 'width 0.6s ease' }} />
            </div>

            {/* Steps list */}
            <div style={{ background: '#fff', border: '1px solid #e6e0d3', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${s.done ? '#0f7d56' : '#5b50d8'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, color: s.done ? '#0f7d56' : '#5b50d8', background: s.done ? '#e8f5ef' : 'transparent' }}>
                    {s.done ? '✓' : '·'}
                  </span>
                  <span style={{ fontSize: 13, color: s.done ? '#8b93a1' : '#16181d', textDecoration: s.done ? 'line-through' : 'none', textDecorationColor: '#ccc' }}>{s.text}</span>
                  {!s.done && (
                    <span className="al-mono" style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#5b50d8' }}>{s.pct}%</span>
                  )}
                </div>
              ))}
            </div>

            {/* Console */}
            <div
              ref={consoleRef}
              style={{ background: '#16181d', borderRadius: 12, padding: '14px 16px', maxHeight: 140, overflowY: 'auto', marginBottom: 16 }}
            >
              {consoleLines.map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '2px 0' }}>
                  <span className="al-mono" style={{ color: '#3ddc97', fontSize: 11, flexShrink: 0 }}>›</span>
                  <span className="al-serif" style={{ fontSize: 12, color: '#aab2bf', lineHeight: 1.4 }}>{line.replace(/^› /, '')}</span>
                  {i === consoleLines.length - 1 && (
                    <span style={{ display: 'inline-block', width: 6, height: 12, background: '#5b50d8', borderRadius: 1, animation: 'al-blink 1.2s step-end infinite', marginLeft: 2 }} />
                  )}
                </div>
              ))}
            </div>

            <p className="al-mono" style={{ textAlign: 'center', fontSize: 11, color: '#8b93a1' }}>1 credit used · Research &amp; education only</p>
          </>
        )}
      </div>
    </div>
  )
}
