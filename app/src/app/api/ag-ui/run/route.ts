import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { toolByName, openaiTools, sanitizeForAgent } from '@/lib/agui/tools'

// AG-UI endpoint (Agent–User Interaction Protocol) — SSE streaming.
// Agent applicatif gpt-4o-mini connecté aux VRAIS outils de l'app. Émet les
// événements AG-UI : RunStarted, StateSnapshot, ToolCall*, TextMessage*, RunFinished/RunError.

const MODEL = process.env.AG_UI_MODEL || 'gpt-4o-mini'
const MAX_TOOL_ROUNDS = 4

const SYSTEM = `Tu es l'agent intégré d'AlphaLens Daily, un produit qui relie chaque news financière aux marchés de prédiction réels (Polymarket) et au portefeuille de l'utilisateur.
Tu aides l'utilisateur à comprendre les marchés, l'actu et ce que ça implique pour son portefeuille.
RÈGLES NON NÉGOCIABLES :
- N'invente JAMAIS une probabilité, un %, un prix ou un chiffre. Les seuls chiffres autorisés viennent des outils (marchés réels Polymarket, quotes réelles). Si tu n'as pas la donnée, appelle l'outil ou dis-le.
- Utilise les outils déclarés pour répondre avec des données réelles : search_markets, get_news, get_quotes, get_macro_snapshot.
- Reste informationnel et éducatif : jamais de conseil personnalisé « achète/vends ».
- Explique brièvement ce que tu fais. Réponses concises, claires, en français si l'utilisateur écrit en français.`

interface AguiMessage { role?: string; content?: unknown }

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const threadId: string = body.threadId || crypto.randomUUID()
  const runId: string = body.runId || crypto.randomUUID()
  const userMessages: AguiMessage[] = Array.isArray(body.messages) ? body.messages : []
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ ...event, timestamp: new Date().toISOString() })}\n\n`))

      try {
        send({ type: 'RunStarted', threadId, runId })
        send({ type: 'StateSnapshot', snapshot: sanitizeForAgent({ route: body?.state?.route ?? '/', product: 'AlphaLens Daily', tools: [...toolByName.keys()] }) })

        if (!process.env.OPENAI_API_KEY) {
          send({ type: 'RunError', message: "L'assistant est momentanément indisponible (configuration manquante).", code: 'NO_KEY' })
          controller.close(); return
        }
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 3 })

        // Historique → format OpenAI.
        type OAMsg = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string; tool_calls?: unknown[]; tool_call_id?: string }
        const messages: OAMsg[] = [{ role: 'system', content: SYSTEM }]
        for (const m of userMessages) {
          const role = m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user'
          messages.push({ role, content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content ?? '') })
        }

        // Boucle d'outils (function calling).
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          send({ type: 'StepStarted', stepName: `reasoning_${round}` })
          const res = await client.chat.completions.create({
            model: MODEL, messages: messages as never, tools: openaiTools(), tool_choice: 'auto', max_tokens: 1200,
          })
          const msg = res.choices[0]?.message
          const calls = msg?.tool_calls ?? []
          send({ type: 'StepFinished', stepName: `reasoning_${round}` })
          if (!calls.length) {
            // Pas d'outil → on stream la réponse finale.
            messages.push({ role: 'assistant', content: msg?.content ?? '' })
            break
          }
          // Exécute chaque outil et émet les événements AG-UI.
          // content vidé : on ne garde que les tool_calls (évite que du contenu
          // partiel/JSON de la phase outils fuite dans la réponse finale).
          messages.push({ role: 'assistant', content: '', tool_calls: calls as unknown[] })
          for (const call of calls) {
            if (call.type !== 'function') continue
            const name = call.function.name || ''
            const argStr = call.function.arguments || '{}'
            send({ type: 'ToolCallStart', toolCallId: call.id, toolCallName: name })
            send({ type: 'ToolCallArgs', toolCallId: call.id, delta: argStr })
            send({ type: 'ToolCallEnd', toolCallId: call.id })
            let result: unknown
            try {
              const tool = toolByName.get(name)
              const args = JSON.parse(argStr || '{}')
              result = tool ? await tool.run(args) : { error: `outil inconnu: ${name}` }
            } catch (e) {
              result = { error: String(e instanceof Error ? e.message : e) }
            }
            const safe = sanitizeForAgent(result)
            send({ type: 'ToolCallResult', messageId: crypto.randomUUID(), toolCallId: call.id, content: JSON.stringify(safe), role: 'tool' })
            messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(safe) })
          }
        }

        // Réponse finale en streaming (pas de nouvel appel d'outil).
        const messageId = crypto.randomUUID()
        send({ type: 'TextMessageStart', messageId, role: 'assistant' })
        // Pas de `tools` ici → le modèle ne peut plus appeler d'outil, il rédige.
        const finalStream = await client.chat.completions.create({
          model: MODEL, messages: messages as never, max_tokens: 900, stream: true,
        })
        let any = false
        for await (const chunk of finalStream) {
          const delta = chunk.choices[0]?.delta?.content || ''
          if (delta) { any = true; send({ type: 'TextMessageContent', messageId, delta }) }
        }
        if (!any) send({ type: 'TextMessageContent', messageId, delta: "Je n'ai pas pu formuler de réponse — reformule ta question." })
        send({ type: 'TextMessageEnd', messageId })
        send({ type: 'RunFinished', threadId, runId, outcome: { type: 'success' } })
      } catch (err) {
        send({ type: 'RunError', message: String(err instanceof Error ? err.message : err), code: 'AGUI_RUN_ERROR' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } })
}
