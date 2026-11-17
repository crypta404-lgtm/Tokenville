export type Worker = {
  id: string
  type: string
  task: string
  action: string
  isAwake: boolean
  startedAt: number
  /** Terminou por último: mostra o balão "Terminei" até o próximo evento. */
  justDone?: boolean
  /** Tipo do agente que o chamou (conversa entre agentes); ausente = Claude. */
  parentType?: string
  /** Nível de potência escolhido: baixo | medio | alto. */
  level?: 'baixo' | 'medio' | 'alto'
  /** Por que esse nível (função, tarefa, modo). */
  reason?: string
}
/** Onde o Claude está: '' é a frente do quadro branco; senão, ao lado do agente. */
export type Ceo = {
  from: string
  at: string
  movedAt: number
  say: string
}

declare module 'claude-code' {
  interface PluginState {
    'tokenville': {
      workers: Shaped<Worker[]>
      ceo: Shaped<Ceo>
      /** Último pedido seu neste chat (aparece no quadro branco). */
      pedido: Shaped<string>
    }
  }
}
