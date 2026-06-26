// Shared football helpers: FIFA 3-letter code (TLA) → ISO-2 → flag emoji,
// plus light normalization used to cross-reference the three data sources.

// FIFA TLA → ISO 3166-1 alpha-2. Covers the 48 WC2026 participants and a few
// extras; falls back gracefully when a code is unknown.
const TLA_TO_ISO2: Record<string, string> = {
  MEX: 'MX', RSA: 'ZA', KOR: 'KR', CZE: 'CZ', CAN: 'CA', BIH: 'BA', USA: 'US',
  PAR: 'PY', QAT: 'QA', SUI: 'CH', BRA: 'BR', MAR: 'MA', HAI: 'HT', AUS: 'AU',
  TUR: 'TR', GER: 'DE', CUW: 'CW', NED: 'NL', JPN: 'JP', CIV: 'CI', ECU: 'EC',
  SWE: 'SE', TUN: 'TN', ESP: 'ES', CPV: 'CV', BEL: 'BE', EGY: 'EG', KSA: 'SA',
  URU: 'UY', IRN: 'IR', NZL: 'NZ', FRA: 'FR', SEN: 'SN', IRQ: 'IQ', NOR: 'NO',
  ARG: 'AR', ALG: 'DZ', AUT: 'AT', JOR: 'JO', POR: 'PT', COD: 'CD', CRO: 'HR',
  GHA: 'GH', PAN: 'PA', UZB: 'UZ', COL: 'CO', ITA: 'IT', POL: 'PL', DEN: 'DK',
  SRB: 'RS', WAL: 'GB-WLS', NGA: 'NG', CMR: 'CM', GRE: 'GR', UKR: 'UA',
}

// Special-case flag emojis that aren't a simple regional-indicator pair.
const SPECIAL_FLAGS: Record<string, string> = {
  ENG: '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}', // England
  SCO: '🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}', // Scotland
  WAL: '🏴\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}', // Wales
}

function iso2ToEmoji(iso2: string): string {
  const base = 0x1f1e6
  return [...iso2.toUpperCase()]
    .map(c => String.fromCodePoint(base + (c.charCodeAt(0) - 65)))
    .join('')
}

/** FIFA 3-letter code → flag emoji. Returns 🏳️ if the code is unknown. */
export function flagForTla(tla?: string): string {
  if (!tla) return '🏳️'
  const code = tla.toUpperCase()
  if (SPECIAL_FLAGS[code]) return SPECIAL_FLAGS[code]
  const iso2 = TLA_TO_ISO2[code]
  return iso2 && iso2.length === 2 ? iso2ToEmoji(iso2) : '🏳️'
}

/** Normalize a team name for fuzzy cross-source matching (accents, casing, noise). */
export function normTeam(name?: string): string {
  if (!name) return ''
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\b(fc|national team|the)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

/** Stable id from two TLAs (home-away), lowercased — matches the mock id style. */
export function matchSlug(homeTla?: string, awayTla?: string, fallback?: string): string {
  if (homeTla && awayTla) return `${homeTla}-${awayTla}`.toLowerCase()
  return fallback ?? 'unknown'
}

// WC2026 nation name → FIFA TLA, keyed by normTeam() and including the aliases
// other providers (thesportsdb) use. Lets us rebuild fixtures when only a
// name-based source is available.
const NAME_TO_TLA: Record<string, string> = {
  mexico: 'MEX', southafrica: 'RSA', southkorea: 'KOR', korearepublic: 'KOR',
  czechia: 'CZE', czechrepublic: 'CZE', canada: 'CAN',
  bosniaherzegovina: 'BIH', bosniaandherzegovina: 'BIH',
  unitedstates: 'USA', usa: 'USA', unitedstatesofamerica: 'USA',
  paraguay: 'PAR', qatar: 'QAT', switzerland: 'SUI', brazil: 'BRA', morocco: 'MAR',
  haiti: 'HAI', australia: 'AUS', turkey: 'TUR', turkiye: 'TUR', germany: 'GER',
  curacao: 'CUW', netherlands: 'NED', holland: 'NED', japan: 'JPN',
  ivorycoast: 'CIV', cotedivoire: 'CIV', ecuador: 'ECU', sweden: 'SWE', tunisia: 'TUN',
  spain: 'ESP', capeverde: 'CPV', capeverdeislands: 'CPV', caboverde: 'CPV', belgium: 'BEL', egypt: 'EGY',
  saudiarabia: 'KSA', uruguay: 'URU', iran: 'IRN', iriran: 'IRN', islamicrepublicofiran: 'IRN',
  newzealand: 'NZL', france: 'FRA', senegal: 'SEN', iraq: 'IRQ', norway: 'NOR',
  argentina: 'ARG', algeria: 'ALG', austria: 'AUT', jordan: 'JOR', portugal: 'POR',
  congodr: 'COD', drcongo: 'COD', democraticrepublicofthecongo: 'COD', congokinshasa: 'COD',
  england: 'ENG', croatia: 'CRO', ghana: 'GHA', panama: 'PAN', uzbekistan: 'UZB', colombia: 'COL',
}

/** Best-effort FIFA TLA for a free-text team name. Falls back to first 3 letters. */
export function tlaForName(name?: string): string {
  if (!name) return '???'
  const key = normTeam(name)
  return NAME_TO_TLA[key] ?? key.slice(0, 3).toUpperCase()
}
