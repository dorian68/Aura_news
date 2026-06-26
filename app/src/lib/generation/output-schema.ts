export interface Scenario {
  label: string
  prob: number
  impact: string
  assets: string[]
}

export interface AssetImpact {
  sym: string
  name: string
  direction: 'up' | 'down' | 'neutral'
  magnitude: string
  reason: string
}

export interface GeneratedReport {
  id: string
  newsId: string
  angleId: string
  createdAt: string

  title: string
  subtitle: string
  executiveSummary: string

  snapshot: {
    event: string
    impact: string
    horizon: string
  }

  pred: {
    yes: number
    no: number
    alpha: number
    gap: string
    compareNote: string
  }

  confPct: string
  confReasons: string[]

  pricedIn: string[]
  notPricedIn: string[]

  scenarios: Scenario[]
  assets: AssetImpact[]

  risks: { label: string; severity: 'high' | 'medium' | 'low' }[]

  finalTake: string

  sections: {
    heading: string
    body: string
  }[]

  sources: { name: string; url: string }[]
}
