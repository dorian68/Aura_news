import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeneratedReport } from './generation/output-schema'
import type { TradeReport } from './generation/trade-prompt'
import type { NewsItem, MatchWarmup } from './types'

export type { NewsItem }

interface Credits {
  count: number
  plan: 'free' | 'starter' | 'pro' | 'power'
}

interface TokenUsage {
  input: number
  output: number
}

interface AppState {
  credits: Credits
  tokenUsage: TokenUsage
  savedReports: GeneratedReport[]
  savedTradeReports: TradeReport[]
  watchlist: string[]
  activeReport: GeneratedReport | null

  // Modal state
  showAngleModal: boolean
  showCreditsModal: boolean
  activeNewsForAngle: NewsItem | null
  selectedAngleId: string

  setCredits: (c: Credits) => void
  debitCredit: () => boolean
  addTokenUsage: (input: number, output: number) => void
  setActiveReport: (r: GeneratedReport | null) => void
  saveReport: (r: GeneratedReport) => void
  removeReport: (id: string) => void
  saveTradeReport: (r: TradeReport) => void
  removeTradeReport: (id: string) => void
  addToWatchlist: (sym: string) => void
  removeFromWatchlist: (sym: string) => void

  openAngleModal: (news: NewsItem) => void
  closeAngleModal: () => void
  setSelectedAngle: (id: string) => void
  openCreditsModal: () => void
  closeCreditsModal: () => void

  // World Cup
  showMatchAngleModal: boolean
  activeMatchId: string | null
  activeMatchName: string
  matchAngleId: string
  goalAlert: boolean
  savedMatchReports: MatchWarmup[]

  openMatchAngleModal: (matchId: string, matchName: string) => void
  closeMatchAngleModal: () => void
  setMatchAngle: (id: string) => void
  triggerGoalAlert: () => void
  dismissGoalAlert: () => void
  saveMatchReport: (r: MatchWarmup) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      credits: { count: 3, plan: process.env.NEXT_PUBLIC_UNLIMITED_CREDITS === '1' ? 'power' : 'free' },
      tokenUsage: { input: 0, output: 0 },
      savedReports: [],
      savedTradeReports: [],
      watchlist: ['SPY', 'GLD', 'EUR/USD'],
      activeReport: null,

      showAngleModal: false,
      showCreditsModal: false,
      activeNewsForAngle: null,
      selectedAngleId: 'macro',

      setCredits: (c) => set({ credits: c }),

      debitCredit: () => {
        const { credits } = get()
        if (credits.plan === 'power') return true
        if (credits.count <= 0) return false
        set({ credits: { ...credits, count: credits.count - 1 } })
        return true
      },

      addTokenUsage: (input, output) =>
        set((s) => ({ tokenUsage: { input: s.tokenUsage.input + input, output: s.tokenUsage.output + output } })),

      setActiveReport: (r) => set({ activeReport: r }),

      saveReport: (r) =>
        set((s) => ({
          savedReports: [r, ...s.savedReports.filter((x) => x.id !== r.id)],
        })),

      removeReport: (id) =>
        set((s) => ({ savedReports: s.savedReports.filter((r) => r.id !== id) })),

      saveTradeReport: (r) =>
        set((s) => ({ savedTradeReports: [r, ...s.savedTradeReports.filter((x) => x.id !== r.id)] })),

      removeTradeReport: (id) =>
        set((s) => ({ savedTradeReports: s.savedTradeReports.filter((r) => r.id !== id) })),

      addToWatchlist: (sym) =>
        set((s) => ({
          watchlist: s.watchlist.includes(sym) ? s.watchlist : [...s.watchlist, sym],
        })),

      removeFromWatchlist: (sym) =>
        set((s) => ({ watchlist: s.watchlist.filter((s2) => s2 !== sym) })),

      openAngleModal: (news) => set({ showAngleModal: true, activeNewsForAngle: news }),
      closeAngleModal: () => set({ showAngleModal: false }),
      setSelectedAngle: (id) => set({ selectedAngleId: id }),
      openCreditsModal: () => set({ showCreditsModal: true }),
      closeCreditsModal: () => set({ showCreditsModal: false }),

      // World Cup
      showMatchAngleModal: false,
      activeMatchId: null,
      activeMatchName: '',
      matchAngleId: 'beginner',
      goalAlert: false,
      savedMatchReports: [],

      openMatchAngleModal: (matchId, matchName) => set({ showMatchAngleModal: true, activeMatchId: matchId, activeMatchName: matchName }),
      closeMatchAngleModal: () => set({ showMatchAngleModal: false }),
      setMatchAngle: (id) => set({ matchAngleId: id }),
      triggerGoalAlert: () => set({ goalAlert: true }),
      dismissGoalAlert: () => set({ goalAlert: false }),
      saveMatchReport: (r) => set((s) => ({ savedMatchReports: [r, ...s.savedMatchReports.filter(x => x.id !== r.id)] })),
    }),
    {
      name: 'alphalens-store',
      // Dev credit bypass: NEXT_PUBLIC_UNLIMITED_CREDITS=1 forces the "power"
      // plan on rehydrate → debitCredit() never blocks and the badge shows ∞.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<AppState>) } as AppState
        if (process.env.NEXT_PUBLIC_UNLIMITED_CREDITS === '1') {
          merged.credits = { ...merged.credits, plan: 'power' }
        }
        return merged
      },
    }
  )
)
