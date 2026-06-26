// Helper de logs structurés + masquage de secrets — paradigme backend-first.
// Format: [STEP] [STATUS] [REQUEST] [INPUT] [OUTPUT] [ERROR] [NEXT]

let stepN = 0

export function step(title) {
  stepN += 1
  console.log(`\n[STEP ${stepN}] ${title}`)
}

export function line(tag, msg) {
  console.log(`  [${tag}] ${msg}`)
}

export function status(ok, msg) {
  line('STATUS', `${ok ? 'success ✅' : 'fail ❌'}${msg ? ' — ' + msg : ''}`)
}

export function ok(msg) { status(true, msg) }
export function fail(msg) { status(false, msg) }
export function skip(msg) { line('STATUS', `skipped ⏭️${msg ? ' — ' + msg : ''}`) }

/** Masque un secret: présence + 4 premiers/derniers caractères + longueur. */
export function maskSecret(name, val) {
  if (!val) return line('INPUT', `${name}: ABSENT ❌`)
  const v = String(val)
  const head = v.slice(0, 4)
  const tail = v.length > 8 ? v.slice(-4) : ''
  line('INPUT', `${name}: présent ✅ (${head}...${tail}, len=${v.length})`)
}

export function summary(diagnosis) {
  console.log(`\n===== DIAGNOSTIC =====\n${diagnosis}\n======================`)
}

export function exit(code) { process.exit(code) }
