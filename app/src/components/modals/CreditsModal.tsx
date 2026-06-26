'use client'
import { useAppStore } from '@/lib/store'

interface PlanDef {
  name: string
  price: string
  per: string
  credits: string
  bd: string
  tag?: string
  btnBg: string
  btnBd: string
  btnCol: string
  cta: string
}

const PLANS: PlanDef[] = [
  {
    name: 'Free',
    price: '€0',
    per: '/month',
    credits: '3 credits / day',
    bd: '#e6e0d3',
    btnBg: '#fff',
    btnBd: '#ddd6c6',
    btnCol: '#16181d',
    cta: 'Current plan',
  },
  {
    name: 'Starter',
    price: '€10',
    per: 'one-off',
    credits: '50 credits',
    bd: '#e6e0d3',
    btnBg: '#16181d',
    btnBd: '#16181d',
    btnCol: '#fff',
    cta: 'Buy 50 credits',
  },
  {
    name: 'Pro',
    price: '€39',
    per: 'one-off',
    credits: '300 credits',
    bd: '#ddd9f6',
    tag: 'Best value',
    btnBg: '#5b50d8',
    btnBd: '#5b50d8',
    btnCol: '#fff',
    cta: 'Buy 300 credits',
  },
  {
    name: 'Power',
    price: '€79',
    per: '/month',
    credits: 'Unlimited credits',
    bd: '#e6e0d3',
    btnBg: '#16181d',
    btnBd: '#16181d',
    btnCol: '#fff',
    cta: 'Go unlimited',
  },
]

const FREE_FEATURES = ['3 AI analyses per day', 'All 10 market angles', 'News feed + search']
const PAID_UNLOCKS  = ['No daily limits', 'PDF export', 'Watchlist alerts', 'Priority AI']

export function CreditsModal() {
  const { showCreditsModal, closeCreditsModal, credits } = useAppStore()

  if (!showCreditsModal) return null

  return (
    /* Overlay */
    <div
      className="al-rise"
      onClick={closeCreditsModal}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(20,22,29,.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'al-rise .25s cubic-bezier(.2,.7,.3,1) both',
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#f7f4ec',
          borderRadius: 20,
          width: '100%',
          maxWidth: 820,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(20,26,40,.4)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid #e6e0d3',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <div>
            <h2
              className="al-serif"
              style={{ fontSize: 26, fontWeight: 700, margin: '0 0 5px', color: '#16181d' }}
            >
              Unlock more credits
            </h2>
            <p style={{ margin: 0, color: '#59606e', fontSize: 13.5 }}>
              Replenish your credits to keep pricing market events. You have{' '}
              <span
                className="al-mono"
                style={{ color: '#5b50d8', fontWeight: 600 }}
              >
                {credits.count}
              </span>{' '}
              credits left.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={closeCreditsModal}
            style={{
              flexShrink: 0,
              background: '#fff',
              border: '1px solid #ddd6c6',
              borderRadius: 8,
              color: '#59606e',
              fontSize: 16,
              fontWeight: 500,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        {/* Plans grid */}
        <div style={{
          padding: '22px 28px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 13,
        }}>
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Bottom feature grid */}
        <div style={{
          padding: '6px 28px 26px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}>
          {/* Free features */}
          <div style={{
            background: '#f3f0e8',
            border: '1px solid #e6e0d3',
            borderRadius: 13,
            padding: '15px 17px',
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase' as const,
              letterSpacing: '.06em',
              color: '#59606e',
              marginBottom: 9,
            }}>
              Free plan
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {FREE_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#16181d' }}>
                  <span style={{ color: '#8b93a1', fontSize: 12 }}>·</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Paid unlocks */}
          <div style={{
            background: '#16181d',
            borderRadius: 13,
            padding: '15px 17px',
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase' as const,
              letterSpacing: '.06em',
              color: '#a99bff',
              marginBottom: 9,
            }}>
              Paid unlocks
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PAID_UNLOCKS.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#d2d6dd' }}>
                  <span style={{ color: '#5b50d8', fontSize: 12 }}>✦</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Plan card ────────────────────────────────────────────── */

function PlanCard({ plan }: { plan: PlanDef }) {
  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${plan.bd}`,
      borderRadius: 15,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Optional tag */}
      {plan.tag && (
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            background: '#efeefb',
            color: '#4a40c0',
            borderColor: '#ddd9f6',
            fontSize: 10,
          }}
        >
          {plan.tag}
        </span>
      )}

      {/* Plan name */}
      <div style={{
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '.02em',
        color: '#16181d',
        marginBottom: 3,
      }}>
        {plan.name}
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span className="al-mono" style={{ fontSize: 26, fontWeight: 600, color: '#16181d' }}>
          {plan.price}
        </span>
        <span style={{ fontSize: 12, color: '#8b93a1' }}>{plan.per}</span>
      </div>

      {/* Credits description */}
      <div style={{ fontSize: 12.5, color: '#59606e', marginBottom: 14, flex: 1 }}>
        {plan.credits}
      </div>

      {/* CTA */}
      <button
        className="btn btn-sm"
        style={{
          width: '100%',
          justifyContent: 'center',
          background: plan.btnBg,
          border: `1px solid ${plan.btnBd}`,
          color: plan.btnCol,
        }}
      >
        {plan.cta}
      </button>
    </div>
  )
}
