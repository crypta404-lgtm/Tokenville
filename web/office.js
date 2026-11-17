"use strict";
(() => {
  // hooks/i18n.ts
  var BRAND = "Tokenville";
  var en = {
    // cena
    "room.plan": "PLANNING",
    "room.dev": "DEV",
    "room.qa": "QUALITY",
    "room.sup": "SUPPORT + CAF\xC9",
    "board.title": "CURRENT REQUEST IN THIS CHAT",
    "board.empty": "Waiting for your request in this chat\u2026",
    "status.boss": "\u2605 Team lead",
    "status.working": "\u25CF Working",
    "status.done": "\u2713 Just finished",
    "status.sleeping": "\u263E Sleeping",
    "role.boss": "Claude \xB7 leads the team and talks to you in this chat",
    "role.extra": "Extra agent",
    "card.power": "Power: {level} ({model}, effort {effort})",
    "card.why": "Why: {reason}",
    "card.now": "Now: {action}",
    "card.task": "Task: {task}",
    "card.close": "click outside to close",
    "boss.title": "Claude (lead)",
    // funções
    "r.planejador": "Planner \xB7 only plans and builds the action plan",
    "r.backend-architect": "Backend architect \xB7 APIs and services",
    "r.database-architect": "Database architect \xB7 modeling and schemas",
    "r.ui-ux-designer": "UI/UX designer \xB7 screens, flows and design system",
    "r.typescript-pro": "TypeScript dev \xB7 types and TS code",
    "r.javascript-pro": "JavaScript dev \xB7 modern JS and Node",
    "r.python-pro": "Python dev \xB7 scripts, APIs and automation",
    "r.frontend-developer": "Frontend dev \xB7 React/Next and layouts",
    "r.sql-pro": "SQL specialist \xB7 queries and performance",
    "r.ai-engineer": "AI engineer \xB7 LLMs, RAG and agents",
    "r.prompt-engineer": "Prompt engineer \xB7 instructions and evals",
    "r.code-reviewer": "Code reviewer \xB7 bugs, security and quality",
    "r.test-automator": "QA / Tests \xB7 writes and runs tests",
    "r.security-auditor": "Security auditor \xB7 vulnerabilities",
    "r.performance-engineer": "Performance engineer \xB7 speed and scale",
    "r.debugger": "Debugger \xB7 hunts and fixes errors",
    "r.error-detective": "Error detective \xB7 logs and root cause",
    "r.search-specialist": "Researcher \xB7 finds and summarizes information",
    "r.deployment-engineer": "Deploy engineer \xB7 CI/CD and releases",
    "r.docs-architect": "Documentation writer \xB7 technical docs",
    // potência e modos
    "lv.baixo": "Low",
    "lv.medio": "Medium",
    "lv.alto": "High",
    "mode.ultra": "ULTRA SAVER",
    "mode.economico": "Saver",
    "mode.equilibrado": "Balanced",
    "mode.maximo": "Maximum",
    "mode.ultra.hint": "Everything on low + caveman + low effort even for the lead",
    "mode.economico.hint": "Only low and medium: spends little",
    "mode.equilibrado.hint": "Automatic, based on the task",
    "mode.maximo.hint": "Medium and high: quality over cost",
    "mode.ultra.short": "haiku + caveman",
    "mode.economico.short": "low and medium",
    "mode.equilibrado.short": "automatic",
    "mode.maximo.short": "medium and high",
    "why.role": "role {level}",
    "why.hard": "hard task",
    "why.easy": "simple task",
    "why.long": "long request",
    "why.mode": "{mode} mode",
    // falas
    "say.reading": "Reading {x}",
    "say.writing": "Writing {x}",
    "say.editing": "Editing {x}",
    "say.glob": "Looking for files {x}",
    "say.grep": 'Searching "{x}"',
    "say.running": "Running: {x}",
    "say.search": "Searching the web: {x}",
    "say.fetch": "Opening {x}",
    "say.agent": "Calling {who}: {x}",
    "say.skill": "Using the skill {x}",
    "say.ctx": "\u{1F5DC}\uFE0F Context Mode: {x}",
    "say.map": "\u{1F9ED} Code map: {x}",
    "say.mem": "\u{1F9E0} Memory: {x}",
    "say.headroom": "\u{1F4E6} Headroom: {x}",
    "say.tool": "Using {x}",
    "say.waking": "Waking up\u2026 reading the lead's task",
    "say.askedBy": "{who} asked me: {x}",
    "say.call": "{who}, for this chat's request: {x}",
    "say.needYou": "I need you",
    "say.finished": "Done! {x}",
    "say.interrupted": "I was interrupted.",
    "say.thanks": "Thanks, {who}! Taking this back to the chat.",
    "say.goodJob": "Good job, team!",
    "say.newRequest": "New request in the chat! Let me see\u2026",
    "say.answered": "Done! I answered you in the chat.",
    "say.stopped": "Stopped, you interrupted in the chat.",
    // painel do app
    "pane.working": "{n} working",
    "pane.sleeping": "team sleeping",
    "pane.mode": "mode {mode}",
    "pane.open": "Open full screen",
    "pane.openLong": "\u25B6 Open Office and Token Meter full screen",
    "pane.hint": "F = full screen. The page updates by itself.",
    "pane.idle": "waiting for your request",
    "cmd.desc": "Open Tokenville (Office + Token Meter) full screen",
    "cmd.done": "Tokenville: {url} (open in the browser; F = full screen).",
    // página
    "tab.office": "Office",
    "tab.tokens": "\u{1F4CA} Token Meter",
    "chats.title": "Your chats",
    "chats.loading": "Loading\u2026",
    "chats.none": "No recent chats found.",
    "chats.live": "live",
    "chats.busy": "{n} working",
    "chats.noFolder": "no folder",
    "chats.untitled": "Untitled chat",
    "head.live": "{n} live chats",
    "head.live1": "1 live chat",
    "head.saving": "saved today",
    "ago.now": "now",
    "ago.min": "{n} min",
    "ago.h": "{n} h",
    "ago.d": "{n} d",
    "modes.title": "Usage level",
    "modes.collapse": "Collapse",
    "err.mode": "Could not save the mode.",
    "err.server": "No connection to the Tokenville server.",
    "k.saving": "Saved today",
    "k.savingSub": "{x} saved by Tokenville",
    "k.real": "Real cost today",
    "k.realSub": "{n} model replies",
    "k.normal": "If it were normal",
    "k.normalSub": "everything on Opus, as usual",
    "k.tokens": "Tokens today",
    "k.tokensSub": "{o} output \xB7 {i} input",
    "k.rate": "Rate now",
    "k.rateSub": "average of the last 5 min",
    "k.cache": "Cache",
    "k.cacheSub": "{x} tokens read from cache",
    "c.live": "Live \xB7 last hour (cumulative)",
    "c.normal": "if it were normal",
    "c.real": "real",
    "c.every": "updates every 2s",
    "c.now": "now",
    "c.where": "Where the savings come from (today)",
    "c.model": "Right model for each task",
    "c.rtk": "rtk \xB7 {x} tokens filtered",
    "c.cache": "Claude Code's own cache (built in)",
    "c.whereNote": 'caveman, context-mode and claude-mem save tokens that never get created: there is no honest way to measure "without them", so they are not counted. Cache is shown only as information, because Claude Code already does it without Tokenville.',
    "c.days": "Last {n} days",
    "c.byModel": "By model \xB7 today",
    "c.modelWho": "model \xB7 who",
    "c.tokens": "tokens",
    "c.nothing": "Nothing today yet.",
    "c.topChats": "Chats that spent the most today",
    "c.chat": "chat",
    "c.saving": "saving",
    "c.foot": "Values at equivalent API prices (Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50 per million). On a subscription plan this becomes extra usage limit. Read from Claude Code's real logs.",
    "who.lead": "lead",
    "who.agents": "agents"
  };
  var pt = {
    "room.plan": "PLANEJAMENTO",
    "room.dev": "DEV",
    "room.qa": "QUALIDADE",
    "room.sup": "SUPORTE + COPA",
    "board.title": "PEDIDO ATUAL DESTE CHAT",
    "board.empty": "Aguardando seu pedido neste chat\u2026",
    "status.boss": "\u2605 Chefe da equipe",
    "status.working": "\u25CF Trabalhando",
    "status.done": "\u2713 Acabou de terminar",
    "status.sleeping": "\u263E Dormindo",
    "role.boss": "Claude \xB7 coordena a equipe e conversa com voc\xEA neste chat",
    "role.extra": "Agente extra",
    "card.power": "Pot\xEAncia: {level} ({model}, effort {effort})",
    "card.why": "Por qu\xEA: {reason}",
    "card.now": "Agora: {action}",
    "card.task": "Tarefa: {task}",
    "card.close": "clique fora para fechar",
    "boss.title": "Claude (chefe)",
    "r.planejador": "Planejador \xB7 s\xF3 planeja e monta o plano de a\xE7\xE3o",
    "r.backend-architect": "Arquiteto de backend \xB7 APIs e servi\xE7os",
    "r.database-architect": "Arquiteto de banco de dados \xB7 modelagem e esquemas",
    "r.ui-ux-designer": "Designer UI/UX \xB7 telas, fluxos e design system",
    "r.typescript-pro": "Dev TypeScript \xB7 tipos e c\xF3digo TS",
    "r.javascript-pro": "Dev JavaScript \xB7 JS moderno e Node",
    "r.python-pro": "Dev Python \xB7 scripts, APIs e automa\xE7\xE3o",
    "r.frontend-developer": "Dev Frontend \xB7 React/Next e layouts",
    "r.sql-pro": "Especialista SQL \xB7 consultas e performance",
    "r.ai-engineer": "Engenheiro de IA \xB7 LLMs, RAG e agentes",
    "r.prompt-engineer": "Engenheiro de prompts \xB7 instru\xE7\xF5es e avalia\xE7\xE3o",
    "r.code-reviewer": "Revisor de c\xF3digo \xB7 bugs, seguran\xE7a e qualidade",
    "r.test-automator": "QA / Testes \xB7 cria e roda testes",
    "r.security-auditor": "Auditor de seguran\xE7a \xB7 vulnerabilidades",
    "r.performance-engineer": "Engenheiro de performance \xB7 velocidade e escala",
    "r.debugger": "Debugger \xB7 ca\xE7a e corrige erros",
    "r.error-detective": "Detetive de erros \xB7 logs e causa raiz",
    "r.search-specialist": "Pesquisador \xB7 busca e resume informa\xE7\xE3o",
    "r.deployment-engineer": "Engenheiro de deploy \xB7 CI/CD e publica\xE7\xE3o",
    "r.docs-architect": "Documentador \xB7 documenta\xE7\xE3o t\xE9cnica",
    "lv.baixo": "Baixo",
    "lv.medio": "M\xE9dio",
    "lv.alto": "Alto",
    "mode.ultra": "ULTRA ECONOMIA",
    "mode.economico": "Econ\xF4mico",
    "mode.equilibrado": "Equilibrado",
    "mode.maximo": "M\xE1ximo",
    "mode.ultra.hint": "Tudo no baixo + caveman + effort low at\xE9 no chefe",
    "mode.economico.hint": "S\xF3 baixo e m\xE9dio: gasta pouco",
    "mode.equilibrado.hint": "Autom\xE1tico conforme a tarefa",
    "mode.maximo.hint": "M\xE9dio e alto: qualidade acima de custo",
    "mode.ultra.short": "haiku + caveman",
    "mode.economico.short": "baixo e m\xE9dio",
    "mode.equilibrado.short": "autom\xE1tico",
    "mode.maximo.short": "m\xE9dio e alto",
    "why.role": "fun\xE7\xE3o {level}",
    "why.hard": "tarefa dif\xEDcil",
    "why.easy": "tarefa simples",
    "why.long": "pedido longo",
    "why.mode": "modo {mode}",
    "say.reading": "Lendo {x}",
    "say.writing": "Escrevendo {x}",
    "say.editing": "Editando {x}",
    "say.glob": "Procurando arquivos {x}",
    "say.grep": 'Buscando "{x}"',
    "say.running": "Rodando: {x}",
    "say.search": "Pesquisando: {x}",
    "say.fetch": "Abrindo {x}",
    "say.agent": "Chamando {who}: {x}",
    "say.skill": "Usando a skill {x}",
    "say.ctx": "\u{1F5DC}\uFE0F Context Mode: {x}",
    "say.map": "\u{1F9ED} Mapa do c\xF3digo: {x}",
    "say.mem": "\u{1F9E0} Mem\xF3ria: {x}",
    "say.headroom": "\u{1F4E6} Headroom: {x}",
    "say.tool": "Usando {x}",
    "say.waking": "Acordando\u2026 lendo a tarefa do chefe",
    "say.askedBy": "{who} me pediu: {x}",
    "say.call": "{who}, para o pedido deste chat: {x}",
    "say.needYou": "preciso de voc\xEA",
    "say.finished": "Terminei! {x}",
    "say.interrupted": "Fui interrompido.",
    "say.thanks": "Valeu, {who}! Vou levar isso pro chat.",
    "say.goodJob": "Bom trabalho, equipe!",
    "say.newRequest": "Novo pedido no chat! Deixa eu ver\u2026",
    "say.answered": "Pronto! Respondi voc\xEA no chat.",
    "say.stopped": "Parei, voc\xEA interrompeu no chat.",
    "pane.working": "{n} trabalhando",
    "pane.sleeping": "equipe dormindo",
    "pane.mode": "modo {mode}",
    "pane.open": "Abrir em tela cheia",
    "pane.openLong": "\u25B6 Abrir Escrit\xF3rio e Token\xF4metro em tela cheia",
    "pane.hint": "F = tela cheia. A p\xE1gina atualiza sozinha.",
    "pane.idle": "aguardando seu pedido",
    "cmd.desc": "Abrir o Tokenville (Escrit\xF3rio + Token\xF4metro) em tela cheia",
    "cmd.done": "Tokenville: {url} (abra no navegador; F = tela cheia).",
    "tab.office": "Escrit\xF3rio",
    "tab.tokens": "\u{1F4CA} Token\xF4metro",
    "chats.title": "Seus chats",
    "chats.loading": "Carregando\u2026",
    "chats.none": "Nenhum chat recente encontrado.",
    "chats.live": "ao vivo",
    "chats.busy": "{n} trabalhando",
    "chats.noFolder": "sem pasta",
    "chats.untitled": "Chat sem t\xEDtulo",
    "head.live": "{n} chats ao vivo",
    "head.live1": "1 chat ao vivo",
    "head.saving": "economia hoje",
    "ago.now": "agora",
    "ago.min": "{n} min",
    "ago.h": "{n} h",
    "ago.d": "{n} d",
    "modes.title": "N\xEDvel de uso",
    "modes.collapse": "Recolher",
    "err.mode": "N\xE3o consegui salvar o modo.",
    "err.server": "Sem conex\xE3o com o servidor do Tokenville.",
    "k.saving": "Economia hoje",
    "k.savingSub": "{x} poupados pelo Tokenville",
    "k.real": "Custo real hoje",
    "k.realSub": "{n} respostas do modelo",
    "k.normal": "Se fosse normal",
    "k.normalSub": "tudo no Opus, como sempre",
    "k.tokens": "Tokens hoje",
    "k.tokensSub": "{o} sa\xEDda \xB7 {i} entrada",
    "k.rate": "Ritmo agora",
    "k.rateSub": "m\xE9dia dos \xFAltimos 5 min",
    "k.cache": "Cache",
    "k.cacheSub": "{x} tokens lidos do cache",
    "c.live": "Ao vivo \xB7 \xFAltima hora (acumulado)",
    "c.normal": "se fosse normal",
    "c.real": "real",
    "c.every": "atualiza a cada 2s",
    "c.now": "agora",
    "c.where": "De onde vem a economia (hoje)",
    "c.model": "Modelo certo por tarefa",
    "c.rtk": "rtk \xB7 {x} tokens filtrados",
    "c.cache": "Cache do pr\xF3prio Claude Code (j\xE1 vem de f\xE1brica)",
    "c.whereNote": 'caveman, context-mode e claude-mem economizam tokens que nem chegam a existir: n\xE3o d\xE1 para medir o "sem eles" com honestidade, ent\xE3o n\xE3o entram na conta. O cache aparece s\xF3 como informa\xE7\xE3o, porque o Claude Code j\xE1 faz isso sem o Tokenville.',
    "c.days": "\xDAltimos {n} dias",
    "c.byModel": "Por modelo \xB7 hoje",
    "c.modelWho": "modelo \xB7 quem",
    "c.tokens": "tokens",
    "c.nothing": "Nada hoje ainda.",
    "c.topChats": "Chats que mais gastaram hoje",
    "c.chat": "chat",
    "c.saving": "economia",
    "c.foot": "Valores em pre\xE7o de API equivalente (Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0,10/$0,50 por milh\xE3o). No plano de assinatura isso vira limite de uso que sobra. Lido dos registros reais do Claude Code.",
    "who.lead": "chefe",
    "who.agents": "agentes"
  };
  var es = {
    "room.plan": "PLANIFICACI\xD3N",
    "room.dev": "DEV",
    "room.qa": "CALIDAD",
    "room.sup": "SOPORTE + CAF\xC9",
    "board.title": "PEDIDO ACTUAL DE ESTE CHAT",
    "board.empty": "Esperando tu pedido en este chat\u2026",
    "status.boss": "\u2605 Jefe del equipo",
    "status.working": "\u25CF Trabajando",
    "status.done": "\u2713 Acaba de terminar",
    "status.sleeping": "\u263E Durmiendo",
    "role.boss": "Claude \xB7 coordina el equipo y habla contigo en este chat",
    "role.extra": "Agente extra",
    "card.power": "Potencia: {level} ({model}, effort {effort})",
    "card.why": "Por qu\xE9: {reason}",
    "card.now": "Ahora: {action}",
    "card.task": "Tarea: {task}",
    "card.close": "haz clic fuera para cerrar",
    "boss.title": "Claude (jefe)",
    "r.planejador": "Planificador \xB7 solo planifica y arma el plan de acci\xF3n",
    "r.backend-architect": "Arquitecto de backend \xB7 APIs y servicios",
    "r.database-architect": "Arquitecto de bases de datos \xB7 modelado y esquemas",
    "r.ui-ux-designer": "Dise\xF1ador UI/UX \xB7 pantallas, flujos y design system",
    "r.typescript-pro": "Dev TypeScript \xB7 tipos y c\xF3digo TS",
    "r.javascript-pro": "Dev JavaScript \xB7 JS moderno y Node",
    "r.python-pro": "Dev Python \xB7 scripts, APIs y automatizaci\xF3n",
    "r.frontend-developer": "Dev Frontend \xB7 React/Next y layouts",
    "r.sql-pro": "Especialista SQL \xB7 consultas y rendimiento",
    "r.ai-engineer": "Ingeniero de IA \xB7 LLMs, RAG y agentes",
    "r.prompt-engineer": "Ingeniero de prompts \xB7 instrucciones y evaluaci\xF3n",
    "r.code-reviewer": "Revisor de c\xF3digo \xB7 bugs, seguridad y calidad",
    "r.test-automator": "QA / Pruebas \xB7 crea y ejecuta pruebas",
    "r.security-auditor": "Auditor de seguridad \xB7 vulnerabilidades",
    "r.performance-engineer": "Ingeniero de rendimiento \xB7 velocidad y escala",
    "r.debugger": "Debugger \xB7 caza y corrige errores",
    "r.error-detective": "Detective de errores \xB7 logs y causa ra\xEDz",
    "r.search-specialist": "Investigador \xB7 busca y resume informaci\xF3n",
    "r.deployment-engineer": "Ingeniero de deploy \xB7 CI/CD y publicaci\xF3n",
    "r.docs-architect": "Documentador \xB7 documentaci\xF3n t\xE9cnica",
    "lv.baixo": "Bajo",
    "lv.medio": "Medio",
    "lv.alto": "Alto",
    "mode.ultra": "ULTRA AHORRO",
    "mode.economico": "Ahorro",
    "mode.equilibrado": "Equilibrado",
    "mode.maximo": "M\xE1ximo",
    "mode.ultra.hint": "Todo en bajo + caveman + effort low incluso en el jefe",
    "mode.economico.hint": "Solo bajo y medio: gasta poco",
    "mode.equilibrado.hint": "Autom\xE1tico seg\xFAn la tarea",
    "mode.maximo.hint": "Medio y alto: calidad sobre costo",
    "mode.ultra.short": "haiku + caveman",
    "mode.economico.short": "bajo y medio",
    "mode.equilibrado.short": "autom\xE1tico",
    "mode.maximo.short": "medio y alto",
    "why.role": "funci\xF3n {level}",
    "why.hard": "tarea dif\xEDcil",
    "why.easy": "tarea simple",
    "why.long": "pedido largo",
    "why.mode": "modo {mode}",
    "say.reading": "Leyendo {x}",
    "say.writing": "Escribiendo {x}",
    "say.editing": "Editando {x}",
    "say.glob": "Buscando archivos {x}",
    "say.grep": 'Buscando "{x}"',
    "say.running": "Ejecutando: {x}",
    "say.search": "Buscando en la web: {x}",
    "say.fetch": "Abriendo {x}",
    "say.agent": "Llamando a {who}: {x}",
    "say.skill": "Usando la skill {x}",
    "say.ctx": "\u{1F5DC}\uFE0F Context Mode: {x}",
    "say.map": "\u{1F9ED} Mapa del c\xF3digo: {x}",
    "say.mem": "\u{1F9E0} Memoria: {x}",
    "say.headroom": "\u{1F4E6} Headroom: {x}",
    "say.tool": "Usando {x}",
    "say.waking": "Despertando\u2026 leyendo la tarea del jefe",
    "say.askedBy": "{who} me pidi\xF3: {x}",
    "say.call": "{who}, para el pedido de este chat: {x}",
    "say.needYou": "te necesito",
    "say.finished": "\xA1Listo! {x}",
    "say.interrupted": "Me interrumpieron.",
    "say.thanks": "\xA1Gracias, {who}! Llevo esto al chat.",
    "say.goodJob": "\xA1Buen trabajo, equipo!",
    "say.newRequest": "\xA1Nuevo pedido en el chat! D\xE9jame ver\u2026",
    "say.answered": "\xA1Listo! Te respond\xED en el chat.",
    "say.stopped": "Par\xE9, interrumpiste en el chat.",
    "pane.working": "{n} trabajando",
    "pane.sleeping": "equipo durmiendo",
    "pane.mode": "modo {mode}",
    "pane.open": "Abrir en pantalla completa",
    "pane.openLong": "\u25B6 Abrir Oficina y Token\xF3metro en pantalla completa",
    "pane.hint": "F = pantalla completa. La p\xE1gina se actualiza sola.",
    "pane.idle": "esperando tu pedido",
    "cmd.desc": "Abrir Tokenville (Oficina + Token\xF3metro) en pantalla completa",
    "cmd.done": "Tokenville: {url} (\xE1brelo en el navegador; F = pantalla completa).",
    "tab.office": "Oficina",
    "tab.tokens": "\u{1F4CA} Token\xF3metro",
    "chats.title": "Tus chats",
    "chats.loading": "Cargando\u2026",
    "chats.none": "No se encontraron chats recientes.",
    "chats.live": "en vivo",
    "chats.busy": "{n} trabajando",
    "chats.noFolder": "sin carpeta",
    "chats.untitled": "Chat sin t\xEDtulo",
    "head.live": "{n} chats en vivo",
    "head.live1": "1 chat en vivo",
    "head.saving": "ahorro hoy",
    "ago.now": "ahora",
    "ago.min": "{n} min",
    "ago.h": "{n} h",
    "ago.d": "{n} d",
    "modes.title": "Nivel de uso",
    "modes.collapse": "Contraer",
    "err.mode": "No pude guardar el modo.",
    "err.server": "Sin conexi\xF3n con el servidor de Tokenville.",
    "k.saving": "Ahorro hoy",
    "k.savingSub": "{x} ahorrados por Tokenville",
    "k.real": "Costo real hoy",
    "k.realSub": "{n} respuestas del modelo",
    "k.normal": "Si fuera normal",
    "k.normalSub": "todo en Opus, como siempre",
    "k.tokens": "Tokens hoy",
    "k.tokensSub": "{o} salida \xB7 {i} entrada",
    "k.rate": "Ritmo ahora",
    "k.rateSub": "promedio de los \xFAltimos 5 min",
    "k.cache": "Cach\xE9",
    "k.cacheSub": "{x} tokens le\xEDdos de la cach\xE9",
    "c.live": "En vivo \xB7 \xFAltima hora (acumulado)",
    "c.normal": "si fuera normal",
    "c.real": "real",
    "c.every": "se actualiza cada 2s",
    "c.now": "ahora",
    "c.where": "De d\xF3nde viene el ahorro (hoy)",
    "c.model": "Modelo correcto para cada tarea",
    "c.rtk": "rtk \xB7 {x} tokens filtrados",
    "c.cache": "Cach\xE9 propia de Claude Code (viene de f\xE1brica)",
    "c.whereNote": 'caveman, context-mode y claude-mem ahorran tokens que ni llegan a existir: no hay forma honesta de medir el "sin ellos", as\xED que no se cuentan. La cach\xE9 aparece solo como informaci\xF3n, porque Claude Code ya la usa sin Tokenville.',
    "c.days": "\xDAltimos {n} d\xEDas",
    "c.byModel": "Por modelo \xB7 hoy",
    "c.modelWho": "modelo \xB7 qui\xE9n",
    "c.tokens": "tokens",
    "c.nothing": "Nada hoy todav\xEDa.",
    "c.topChats": "Chats que m\xE1s gastaron hoy",
    "c.chat": "chat",
    "c.saving": "ahorro",
    "c.foot": "Valores a precio de API equivalente (Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0,10/$0,50 por mill\xF3n). En un plan de suscripci\xF3n esto se convierte en l\xEDmite de uso extra. Le\xEDdo de los registros reales de Claude Code.",
    "who.lead": "jefe",
    "who.agents": "agentes"
  };
  var LANGS = { en, pt, es };
  var current = "en";
  function pickLang(locale) {
    const code = String(locale || "").toLowerCase().slice(0, 2);
    return code in LANGS ? code : "en";
  }
  function setLang(l) {
    current = l;
  }
  function t(key, vars2) {
    let s = LANGS[current][key] ?? en[key] ?? key;
    if (vars2) for (const [k2, v] of Object.entries(vars2)) s = s.split(`{${k2}}`).join(String(v));
    return s;
  }
  function roleOf(type) {
    const k2 = `r.${type}`;
    return k2 in en ? t(k2) : "";
  }

  // hooks/power.ts
  var MODE_LIST = ["ultra", "economico", "equilibrado", "maximo"];
  var modeLabel = (m) => t(`mode.${m}`);
  var modeHint = (m) => t(`mode.${m}.hint`);
  var modeShort = (m) => t(`mode.${m}.short`);
  var levelLabel = (l) => t(`lv.${l}`);
  var isMode = (m) => m === "ultra" || m === "economico" || m === "equilibrado" || m === "maximo";
  var MODEL = { baixo: "haiku", medio: "sonnet", alto: "opus" };
  var EFFORT = { baixo: "low", medio: "medium", alto: "high" };

  // hooks/scene.ts
  var P = 2;
  var SW = 16 * P;
  var SH = 24 * P;
  var OUT = "#2a1d2e";
  var FONT = `'Pixelify Sans', 'Silkscreen', ui-monospace, monospace`;
  var LEVEL_COLOR = { baixo: "#6ee7a0", medio: "#ffd166", alto: "#ff7b6b" };
  var ROOM_W = 400;
  var WALL = 48;
  var ROOM_H = { plan: 206, dev: 270, qa: 178, sup: 270 };
  var ROOM_SEATS = {
    plan: [["planejador", 52, 66], ["backend-architect", 140, 66], ["database-architect", 228, 66], ["ui-ux-designer", 316, 66]],
    dev: [
      ["typescript-pro", 28, 80],
      ["javascript-pro", 122, 80],
      ["python-pro", 216, 80],
      ["frontend-developer", 310, 80],
      ["sql-pro", 74, 182],
      ["ai-engineer", 168, 182],
      ["prompt-engineer", 262, 182]
    ],
    qa: [["code-reviewer", 28, 82], ["test-automator", 122, 82], ["security-auditor", 216, 82], ["performance-engineer", 310, 82]],
    sup: [["debugger", 28, 80], ["error-detective", 122, 80], ["search-specialist", 216, 80], ["deployment-engineer", 52, 182], ["docs-architect", 146, 182]]
  };
  var KNOWN = new Set(Object.values(ROOM_SEATS).flat().map((s) => s[0]));
  function layout(wide, extras) {
    const G = 10;
    const rooms = wide ? [
      { kind: "plan", ox: G, oy: G },
      { kind: "dev", ox: G, oy: G + ROOM_H.plan + G },
      { kind: "qa", ox: G + ROOM_W + G, oy: G },
      { kind: "sup", ox: G + ROOM_W + G, oy: G + ROOM_H.qa + G }
    ] : ["plan", "dev", "qa", "sup"].reduce((acc, kind) => {
      const prev = acc[acc.length - 1];
      acc.push({ kind, ox: G, oy: prev ? prev.oy + ROOM_H[prev.kind] + G : G });
      return acc;
    }, []);
    const W = wide ? G * 3 + ROOM_W * 2 : ROOM_W + G * 2;
    const H = Math.max(...rooms.map((r2) => r2.oy + ROOM_H[r2.kind])) + G;
    const seats = {};
    for (const r2 of rooms)
      for (const [name, x, y] of ROOM_SEATS[r2.kind])
        seats[name] = { x: r2.ox + x, y: r2.oy + y, kind: r2.kind === "plan" ? "table" : "desk" };
    const plan = rooms[0];
    extras.forEach((tp, i) => {
      seats[tp] = { x: plan.ox + 20 + i % 9 * 40, y: plan.oy + 150, kind: "stand" };
    });
    return { W, H, rooms, seats, ceoHome: { x: plan.ox + 184, y: plan.oy + 44 } };
  }
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
    return "#" + (1 << 24 | c(n >> 16 & 255) << 16 | c(n >> 8 & 255) << 8 | c(n & 255)).toString(16).slice(1);
  }
  var r = (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;
  var box = (x, y, w, h, fill, stroke = OUT) => r(x, y, w, h, fill, ` stroke="${stroke}" stroke-width="1.5"`);
  var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  var txt = (x, y, s, size, fill, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" font-family="${FONT}" fill="${fill}"${extra}>${esc(s)}</text>`;
  var HAIR = ["#3b2a20", "#6b3e1f", "#e8c15a", "#c4562f", "#1f1b2d", "#a9a9b8", "#6a4ba0", "#efe3c8", "#8a5a32", "#2f5aa0", "#d9709f", "#2c7a6b"];
  var SKIN = ["#ffe0c2", "#f6c9a0", "#e3a878", "#c68642", "#8d5524", "#ffd7b0"];
  var SHIRT = ["#4f7cff", "#36b37e", "#ff6b6b", "#ffb84d", "#9b6cff", "#22b8c8", "#ff7fbf", "#7a8b99", "#e04848", "#3a4fa8", "#8fd14f", "#f2f2ee", "#2f3542"];
  var PANTS = ["#2c3e66", "#3b3b46", "#5c4033", "#22313f", "#4b3b6b", "#3d5a4a"];
  function pal(hair, skin, shirt, pants) {
    return {
      H: hair,
      h: shade(hair, 0.72),
      L: shade(hair, 1.35),
      S: skin,
      s: shade(skin, 0.86),
      X: shade(skin, 0.9),
      B: shirt,
      b: shade(shirt, 0.78),
      W: shade(shirt, 1.45),
      P: pants,
      C: shade(shirt, 0.92)
    };
  }
  var BOSS = { pal: pal("#4a2f1e", "#ffe0c2", "#d97757", "#3b2a20"), hair: 0, glasses: false, beard: false, stripes: false };
  function look(type) {
    if (type === "claude") return BOSS;
    const h = hash(type);
    return {
      pal: pal(HAIR[h % HAIR.length], SKIN[(h >>> 4) % SKIN.length], SHIRT[(h >>> 8) % SHIRT.length], PANTS[(h >>> 12) % PANTS.length]),
      hair: (h >>> 16) % 6,
      glasses: (h >>> 19 & 3) === 0,
      beard: (h >>> 21 & 7) === 0,
      stripes: (h >>> 24 & 3) === 0
    };
  }
  var FIXED = { O: OUT, E: "#1d1424", M: "#b5544f", K: "#2a2230", G: "#3a3346" };
  var BASE = [
    "................",
    "....OOOOOOOO....",
    "...OHHHHHHHHO...",
    "..OHHLLHHHHHHO..",
    "..OHHHHHHHHHHO..",
    ".OHHHHHHHHHHHhO.",
    ".OHhSSSSSSSShHO.",
    ".OHSSSSSSSSSSHO.",
    ".OSSESSSSSSESSO.",
    ".OSSESSSSSSESSO.",
    ".OSXSSSSSSSSXSO.",
    "..OSSSSMMSSSSO..",
    "...OsSSSSSSsO...",
    "....OOssssOO....",
    "...OBBWWWWBBO...",
    "..OBBBBBBBBBBO..",
    ".OBbBBBBBBBBbBO.",
    ".OSbBBBBBBBBbSO.",
    ".OOOBBBBBBBBOOO.",
    "...OPPPPPPPPO...",
    "...OPPPOOPPPO...",
    "...OPPPOOPPPO...",
    "...OKKKOOKKKO...",
    "....OOO..OOO...."
  ];
  function grid(l) {
    const g = BASE.map((row) => row.split(""));
    const set = (y, x, c) => {
      g[y][x] = c;
    };
    switch (l.hair) {
      case 1:
        for (let y = 6; y <= 12; y++) {
          set(y, 2, "H");
          set(y, 13, "h");
        }
        for (let y = 11; y <= 13; y++) {
          set(y, 1, "O");
          set(y, 14, "O");
          set(y, 2, "H");
          set(y, 13, "h");
        }
        break;
      case 2:
        for (let x = 6; x <= 9; x++) {
          set(0, x, "O");
          set(1, x, "H");
        }
        set(1, 7, "L");
        break;
      case 3:
        for (const x of [4, 7, 10]) {
          set(0, x, "O");
          set(1, x, "H");
        }
        break;
      case 4:
        for (let y = 1; y <= 4; y++) for (let x = 3; x <= 12; x++) if (!"O.".includes(g[y][x])) set(y, x, "C");
        g[5] = ".OCCCCCCCCCCCCCO".split("");
        set(3, 5, "W");
        break;
      case 5:
        for (let x = 3; x <= 12; x++) if (g[2][x] !== "O") set(2, x, "G");
        for (let y = 7; y <= 9; y++) {
          set(y, 1, "G");
          set(y, 14, "G");
          set(y, 0, "O");
          set(y, 15, "O");
        }
        break;
    }
    if (l.glasses) {
      for (const x of [3, 5, 10, 12]) set(8, x, "G");
      for (let x = 3; x <= 5; x++) set(7, x, "G");
      for (let x = 10; x <= 12; x++) set(7, x, "G");
    }
    if (l.beard) {
      for (let x = 3; x <= 12; x++) set(10, x, "h");
      for (let x = 3; x <= 12; x++) if (x !== 7 && x !== 8) set(11, x, "h");
      for (let x = 4; x <= 11; x++) set(12, x, "h");
    }
    if (l.stripes) {
      for (const y of [16, 18]) for (let x = 0; x < 16; x++) if (g[y][x] === "B") set(y, x, "W");
    }
    return g;
  }
  var shapeId = (l) => `v${l.hair}${l.glasses ? 1 : 0}${l.beard ? 1 : 0}${l.stripes ? 1 : 0}`;
  function shapeSymbol(l) {
    const paths = {};
    grid(l).forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const c = row[x];
        if (c === ".") {
          x++;
          continue;
        }
        let n = 1;
        while (row[x + n] === c) n++;
        paths[c] = (paths[c] ?? "") + `M${x} ${y}h${n}v1h-${n}z`;
        x += n;
      }
    });
    let out = `<symbol id="${shapeId(l)}" viewBox="0 0 16 24">`;
    for (const c of Object.keys(paths))
      out += FIXED[c] ? `<path d="${paths[c]}" fill="${FIXED[c]}"/>` : `<path d="${paths[c]}" style="fill:var(--${c})"/>`;
    return out + "</symbol>";
  }
  var vars = (l) => Object.entries(l.pal).map(([k2, v]) => `--${k2}:${v}`).join(";");
  function symbols(types) {
    const seen = /* @__PURE__ */ new Map();
    for (const tp of types) {
      const l = look(tp);
      if (!seen.has(shapeId(l))) seen.set(shapeId(l), shapeSymbol(l));
    }
    return [...seen.values()].join("");
  }
  function person(type, x, y, awake, scale = P, still = false) {
    const s = scale;
    const l = look(type);
    const dy = awake ? 0 : s;
    const ey = y + dy + 8 * s;
    const e1 = x + 4 * s, e2 = x + 11 * s;
    const skin = l.pal.S;
    const eyes = awake ? `<g opacity="0">${r(e1, ey, s, 2 * s, skin)}${r(e2, ey, s, 2 * s, skin)}<animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.92;0.96;1" dur="${3 + hash(type) % 7 / 3}s" repeatCount="indefinite"/></g>` : `${r(e1 - s, ey, 3 * s, 2 * s, skin)}${r(e2 - s, ey, 3 * s, 2 * s, skin)}${r(e1 - s, ey + s, 3 * s, s / 2 + 0.5, "#1d1424")}${r(e2 - s, ey + s, 3 * s, s / 2 + 0.5, "#1d1424")}`;
    const motion = still ? "" : awake ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -1;0 0" dur="0.7s" repeatCount="indefinite"/>` : `<animateTransform attributeName="transform" type="translate" values="0 0;0 1;0 0" dur="3s" repeatCount="indefinite"/>`;
    return `<g>${motion}<use href="#${shapeId(l)}" x="${x}" y="${y + dy}" width="${16 * s}" height="${24 * s}" style="${vars(l)}"/>${eyes}</g>`;
  }
  var PATTERNS = `<pattern id="p-wood" width="64" height="12" patternUnits="userSpaceOnUse">${r(0, 0, 64, 12, "#d9b483")}${r(0, 0, 64, 1, "#e6c494")}${r(0, 11, 64, 1, "#b8915f")}${r(20, 0, 1, 12, "#c09a68")}${r(52, 0, 1, 12, "#c09a68")}${r(4, 5, 10, 1, "#d0aa78")}${r(30, 7, 14, 1, "#d0aa78")}</pattern><pattern id="p-wood2" width="64" height="24" patternUnits="userSpaceOnUse"><rect width="64" height="24" fill="url(#p-wood)"/>${r(0, 12, 64, 12, "#00000006")}${r(40, 12, 1, 12, "#c09a68")}</pattern><pattern id="p-carpet" width="8" height="8" patternUnits="userSpaceOnUse">${r(0, 0, 8, 8, "#55617e")}${r(0, 0, 1, 1, "#5f6c8b")}${r(4, 4, 1, 1, "#5f6c8b")}</pattern><pattern id="p-tile" width="24" height="24" patternUnits="userSpaceOnUse">${r(0, 0, 24, 24, "#d7dfe2")}${r(0, 0, 24, 1, "#c2cdd1")}${r(0, 0, 1, 24, "#c2cdd1")}${r(2, 2, 6, 1, "#e4eaec")}</pattern><pattern id="p-check" width="32" height="32" patternUnits="userSpaceOnUse">${r(0, 0, 32, 32, "#efe4cf")}${r(0, 0, 16, 16, "#e3d4b8")}${r(16, 16, 16, 16, "#e3d4b8")}</pattern><pattern id="p-rug" width="12" height="12" patternUnits="userSpaceOnUse">${r(0, 0, 12, 12, "#a3534a")}${r(0, 0, 6, 6, "#b1625a")}${r(6, 6, 6, 6, "#b1625a")}</pattern>`;
  var ZZZ = [0, 1, 2].map(
    (v) => `<g id="zz${v}">` + [0, 1, 2].map((i) => {
      const b = (i * 0.8 + v * 0.45).toFixed(2);
      return `<text x="${24 + i * 6}" y="0" font-size="${8 + i * 3}" font-family="${FONT}" font-weight="700" fill="#eef2ff" stroke="#3a3560" stroke-width="2" paint-order="stroke" opacity="0">z<animate attributeName="opacity" values="0;1;0" dur="3s" begin="${b}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;6 -14" dur="3s" begin="${b}s" repeatCount="indefinite"/></text>`;
    }).join("") + `</g>`
  ).join("");
  var FURNITURE = `<g id="chair">${r(4, 34, 24, 4, "#00000022")}${box(5, 16, 22, 22, "#3f7f78")}${r(7, 18, 18, 3, "#58a199")}${r(7, 30, 18, 6, "#356b65")}</g><g id="desk">` + r(-14, 60, 62, 4, "#00000026") + box(-12, 38, 58, 7, "#d6a76f") + r(-11, 39, 56, 2, "#e7bd88") + box(-12, 45, 58, 16, "#a06d42") + r(-11, 58, 56, 2, "#875a35") + box(-8, 48, 22, 9, "#b07b4d") + r(1, 52, 4, 1.5, "#ecc996") + box(22, 48, 22, 9, "#b07b4d") + r(31, 52, 4, 1.5, "#ecc996") + box(27, 12, 21, 18, "#2e3245") + r(29, 14, 17, 13, "#1b2233") + r(34, 30, 7, 6, "#4b5066") + box(31, 35, 13, 3, "#5a5f78") + box(3, 36, 20, 4, "#e9edf1") + r(5, 37, 16, 1, "#c4ccd4") + `</g><g id="screen">${r(29, 14, 17, 13, "#7fd8ff")}${r(31, 16, 9, 1.5, "#2c7aa8")}${r(31, 19, 12, 1.5, "#2c7aa8")}${r(31, 22, 7, 1.5, "#2c7aa8")}<rect x="29" y="14" width="17" height="1.5" fill="#ffffff" opacity="0.7"><animate attributeName="y" values="14;26" dur="1.6s" repeatCount="indefinite"/></rect></g><g id="plant">${r(0, 30, 20, 4, "#00000025")}${box(3, 18, 14, 13, "#c0703f")}${r(3, 18, 14, 3, "#d98a52")}${box(8, 4, 4, 15, "#2f8f46")}${box(0, 8, 9, 6, "#3fae5a")}${box(11, 6, 9, 6, "#3fae5a")}${box(4, -1, 12, 6, "#5cc777")}${r(2, 9, 3, 1, "#8be3a0")}${r(14, 7, 3, 1, "#8be3a0")}${r(7, 0, 4, 1, "#8be3a0")}</g><g id="shelf">${box(0, 0, 46, 36, "#7a4e2b")}${r(3, 3, 40, 13, "#4a2f19")}${r(3, 20, 40, 13, "#4a2f19")}${r(0, 16, 46, 4, "#8f5d35")}` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
    const c = ["#e04848", "#4f7cff", "#36b37e", "#ffb84d", "#9b6cff", "#22b8c8", "#f2f2ee", "#ff7fbf", "#8fd14f"][i];
    return r(4 + i * 4.3, 5 + i % 3, 3.6, 11 - i % 3, c) + r(4 + i * 4.3, 22 + (i + 1) % 2, 3.6, 11 - (i + 1) % 2, shade(c, 0.85));
  }).join("") + `</g><g id="cabinet">${r(0, 40, 24, 3, "#00000025")}${box(0, 0, 24, 40, "#8e9aa6")}${box(3, 3, 18, 10, "#a3aeb9")}${box(3, 15, 18, 10, "#a3aeb9")}${box(3, 27, 18, 10, "#a3aeb9")}${r(10, 7, 4, 1.5, "#5d6874")}${r(10, 19, 4, 1.5, "#5d6874")}${r(10, 31, 4, 1.5, "#5d6874")}</g>`;
  function windowAt(x, y, w, h) {
    return box(x - 2, y - 2, w + 4, h + 4, "#e8e2d6") + r(x, y, w, h, "#8fd0ff") + r(x, y, w, h / 2, "#b3e0ff") + `<g>${r(x + w - 30, y + 6, 14, 4, "#ffffff")}${r(x + w - 26, y + 4, 8, 3, "#ffffff")}<animateTransform attributeName="transform" type="translate" values="0 0;-${w - 34} 0;0 0" dur="50s" repeatCount="indefinite"/></g>` + r(x + w / 2 - 1, y, 2, h, "#e8e2d6") + r(x - 3, y + h + 2, w + 6, 3, "#d3cbbb");
  }
  function clock(x, y) {
    return `<circle cx="${x}" cy="${y}" r="9" fill="#fbf8f1" stroke="${OUT}" stroke-width="2"/><rect x="${x - 0.75}" y="${y - 6}" width="1.5" height="6" fill="${OUT}"><animateTransform attributeName="transform" type="rotate" values="0 ${x} ${y};360 ${x} ${y}" dur="60s" repeatCount="indefinite"/></rect>` + r(x, y - 0.75, 4, 1.5, OUT);
  }
  function poster(x, y, a, b) {
    return box(x, y, 22, 28, "#fbf8f1") + r(x + 3, y + 3, 16, 13, a) + `<circle cx="${x + 11}" cy="${y + 9}" r="4" fill="${b}"/>` + r(x + 4, y + 20, 14, 2, "#c4bcae") + r(x + 4, y + 24, 9, 2, "#c4bcae");
  }
  var light = (x, y, w, h) => `<polygon points="${x},${y} ${x + w},${y} ${x + w + 26},${y + h} ${x + 26},${y + h}" fill="#fff6d8" opacity="0.13"/>`;
  var ROOM_STYLE = {
    plan: { wall: "#8d7fb0", trim: "#6f6293", floor: "url(#p-carpet)", tag: "#5b4d8a" },
    dev: { wall: "#e9dcc4", trim: "#c9b694", floor: "url(#p-wood2)", tag: "#a8673a" },
    qa: { wall: "#9cc6b4", trim: "#78a593", floor: "url(#p-tile)", tag: "#2f7a5f" },
    sup: { wall: "#e8b4a8", trim: "#c98f84", floor: "url(#p-check)", tag: "#a5485f" }
  };
  function roomArt(kind, ox, oy, pedido) {
    const h = ROOM_H[kind];
    const st = ROOM_STYLE[kind];
    let back = r(ox, oy, ROOM_W, h, st.floor) + r(ox, oy, ROOM_W, 6, "#3a3150") + r(ox, oy + 6, ROOM_W, WALL - 6, st.wall) + r(ox, oy + 30, ROOM_W, WALL - 30, st.trim) + r(ox, oy + 30, ROOM_W, 1.5, shade(st.trim, 1.15)) + r(ox, oy + WALL - 3, ROOM_W, 3, "#5a4434") + r(ox, oy + WALL, ROOM_W, 6, "#000000", ' opacity="0.12"') + r(ox, oy, 4, h, "#3a3150") + r(ox + ROOM_W - 4, oy, 4, h, "#3a3150");
    let front = "";
    const plaque = (label) => {
      const w = Math.max(48, label.length * 5.6 + 12);
      return box(ox + 8, oy + 10, w, 14, st.tag, "#1f1830") + txt(ox + 14, oy + 20.5, label, 8.5, "#fff", ' font-weight="700"');
    };
    if (kind === "plan") {
      const lines = wrap(pedido || t("board.empty"), 34, 2);
      back += light(ox + 300, oy + WALL, 60, 40) + box(ox + 112, oy + 7, 176, 34, "#fbfbf7") + r(ox + 114, oy + 37, 172, 2, "#d8d6cc") + r(ox + 200, oy + 41, 14, 3, "#b9b6aa") + txt(ox + 118, oy + 16, t("board.title"), 6.5, "#d97757", ' font-weight="700"') + lines.map((l, i) => txt(ox + 118, oy + 26 + i * 8.5, l, 7.5, "#2a3550")).join("") + r(ox + 268, oy + 35, 8, 2.5, "#e04848") + r(ox + 278, oy + 35, 5, 2.5, "#4f7cff") + `<use href="#shelf" x="${ox + 300}" y="${oy + 8}"/><use href="#shelf" x="${ox + 350}" y="${oy + 8}"/>` + r(ox + 30, oy + 92, 340, 66, "url(#p-rug)", ' rx="3"') + r(ox + 34, oy + 96, 332, 58, "none", ' stroke="#e8c39b" stroke-width="2" rx="2"') + `<use href="#plant" x="${ox + 10}" y="${oy + h - 40}"/><use href="#plant" x="${ox + ROOM_W - 32}" y="${oy + h - 40}"/>`;
      front += r(ox + 26, oy + 140, 348, 5, "#00000026") + box(ox + 26, oy + 104, 348, 10, "#d6a76f") + r(ox + 27, oy + 105, 346, 2.5, "#e7bd88") + box(ox + 26, oy + 114, 348, 26, "#a06d42") + r(ox + 27, oy + 136, 346, 3, "#875a35");
      back += plaque(t("room.plan"));
    } else if (kind === "dev") {
      back += windowAt(ox + 150, oy + 9, 104, 26) + light(ox + 150, oy + WALL, 104, 70) + poster(ox + 270, oy + 9, "#4f7cff", "#ffb84d") + poster(ox + 298, oy + 9, "#36b37e", "#fbf8f1") + clock(ox + 372, oy + 22) + `<use href="#shelf" x="${ox + 96}" y="${oy + 8}"/><use href="#plant" x="${ox + 10}" y="${oy + h - 40}"/><use href="#plant" x="${ox + ROOM_W - 32}" y="${oy + h - 40}"/><use href="#cabinet" x="${ox + 356}" y="${oy + 150}"/>`;
      back += plaque(t("room.dev"));
    } else if (kind === "qa") {
      back += windowAt(ox + 120, oy + 9, 76, 26) + light(ox + 120, oy + WALL, 76, 60) + box(ox + 214, oy + 9, 62, 28, "#2e3245") + r(ox + 217, oy + 12, 56, 22, "#15281f") + `<polyline points="${ox + 219},${oy + 30} ${ox + 228},${oy + 22} ${ox + 238},${oy + 26} ${ox + 248},${oy + 16} ${ox + 258},${oy + 20} ${ox + 270},${oy + 13}" fill="none" stroke="#6ee7a0" stroke-width="1.5"/><use href="#shelf" x="${ox + 300}" y="${oy + 8}"/><use href="#shelf" x="${ox + 350}" y="${oy + 8}"/><use href="#plant" x="${ox + ROOM_W - 32}" y="${oy + h - 40}"/>`;
      back += plaque(t("room.qa"));
    } else {
      back += windowAt(ox + 120, oy + 9, 70, 26) + light(ox + 120, oy + WALL, 70, 60) + poster(ox + 206, oy + 9, "#ff7fbf", "#ffb84d") + clock(ox + 246, oy + 22) + r(ox + 296, oy + 82, 96, 4, "#00000026") + box(ox + 296, oy + 52, 96, 8, "#d6a76f") + r(ox + 297, oy + 53, 94, 2, "#e7bd88") + box(ox + 296, oy + 60, 96, 24, "#a06d42") + box(ox + 306, oy + 36, 18, 17, "#3a3f58") + r(ox + 310, oy + 40, 10, 5, "#e04848") + box(ox + 330, oy + 44, 8, 9, "#fbf8f1") + `<g>${r(ox + 314, oy + 30, 2, 5, "#ffffff", ' opacity="0.8"')}<animateTransform attributeName="transform" type="translate" values="0 0;2 -10" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite"/></g>` + box(ox + 350, oy + 36, 14, 17, "#bfe6ff") + r(ox + 353, oy + 30, 8, 7, "#8fd0ff") + r(ox + 362, oy + 176, 30, 4, "#00000026") + box(ox + 364, oy + 120, 26, 58, "#dfe4e9") + r(ox + 365, oy + 140, 24, 1.5, "#a3aeb9") + r(ox + 385, oy + 126, 2, 10, "#a3aeb9") + r(ox + 385, oy + 146, 2, 14, "#a3aeb9") + r(ox + 244, oy + 252, 100, 5, "#00000026") + box(ox + 244, oy + 222, 100, 16, "#5f86c6") + box(ox + 244, oy + 236, 100, 18, "#4c6fae") + box(ox + 238, oy + 228, 10, 26, "#5f86c6") + box(ox + 340, oy + 228, 10, 26, "#5f86c6") + `<ellipse cx="${ox + 294}" cy="${oy + 210}" rx="22" ry="8" fill="#d6a76f" stroke="${OUT}" stroke-width="1.5"/>` + box(ox + 285, oy + 205, 7, 5, "#fbf8f1") + box(ox + 297, oy + 206, 9, 4, "#ffb84d") + `<use href="#plant" x="${ox + 10}" y="${oy + h - 40}"/>`;
      back += plaque(t("room.sup"));
    }
    back += r(ox, oy, ROOM_W, h, "none", ` stroke="#1f1830" stroke-width="3"`);
    return { back, front };
  }
  function deskItems(type, x, y) {
    switch (hash(type + "items") % 5) {
      case 0:
        return box(x - 8, y + 30, 7, 8, "#fbf8f1") + r(x - 1, y + 32, 2, 4, "#fbf8f1", ` stroke="${OUT}" stroke-width="1"`) + r(x - 7, y + 31, 5, 2, "#6b3e1f");
      case 1:
        return box(x - 9, y + 30, 8, 8, "#c0703f") + box(x - 8, y + 24, 6, 7, "#3fae5a");
      case 2:
        return box(x - 10, y + 33, 12, 5, "#fbf8f1") + r(x - 9, y + 31, 10, 2, "#e9e4d6");
      case 3:
        return box(x - 9, y + 22, 3, 16, "#3a3f58") + box(x - 10, y + 20, 10, 4, "#ffd166") + r(x - 9, y + 36, 8, 2, "#3a3f58");
      default:
        return box(x - 10, y + 32, 10, 6, "#4f7cff") + box(x - 9, y + 28, 9, 4, "#e04848");
    }
  }
  function wrap(text, width, maxLines) {
    const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    const lines = [];
    let cur = "";
    let cutOff = false;
    for (const w of words) {
      const next = cur ? cur + " " + w : w;
      if (next.length <= width) {
        cur = next;
        continue;
      }
      if (cur) lines.push(cur);
      if (lines.length === maxLines) {
        cutOff = true;
        cur = "";
        break;
      }
      cur = w.length > width ? w.slice(0, width - 1) + "\u2026" : w;
    }
    if (cur && lines.length < maxLines) lines.push(cur);
    else if (cur) cutOff = true;
    if (cutOff && lines.length) {
      const last = lines[lines.length - 1];
      lines[lines.length - 1] = (last.length >= width ? last.slice(0, width - 1) : last) + "\u2026";
    }
    return lines;
  }
  var hits = (a, b) => a.x < b.x + b.w + 4 && b.x < a.x + a.w + 4 && a.y < b.y + b.h + 4 && b.y < a.y + a.h + 4;
  function bubbleGeom(W, c) {
    const lines = wrap(c.text, 26, c.lines);
    const longest = Math.max(1, ...lines.map((l) => l.length));
    const w = Math.round(longest * 5.9 + 16);
    const h = lines.length * 10 + 9;
    const x = Math.round(Math.min(Math.max(4, c.cx - w / 2), W - w - 4));
    const y = Math.max(2, c.headY - h - 10);
    return { rect: { x, y, w, h }, lines };
  }
  function bubbleSvg(rc, lines, c) {
    const { x, y, w, h } = rc;
    const tx = Math.round(Math.min(Math.max(x + 8, c.cx - 4), x + w - 14));
    return `<g class="bubble">` + r(x + 2, y + 3, w, h, "#000000", ' opacity="0.18" rx="4"') + r(x, y, w, h, c.fill, ` stroke="${c.border}" stroke-width="2" rx="4"`) + `<path d="M${tx} ${y + h - 1} l8 0 l-6 7 z" fill="${c.fill}" stroke="${c.border}" stroke-width="2" stroke-linejoin="round"/>` + r(tx + 1, y + h - 2.5, 7, 3, c.fill) + lines.map((l, i) => txt(x + 7, y + 13 + i * 10, l, 8.5, "#241b2f")).join("") + `</g>`;
  }
  function alertSvg(cx, headY) {
    const x = cx - 30, y = headY + 2;
    return `<g class="bubble"><g>` + r(x + 1, y + 2, 14, 16, "#000000", ' opacity="0.2" rx="3"') + r(x, y, 14, 16, "#ff3b3b", ' stroke="#7a0e16" stroke-width="2" rx="3"') + txt(x + 7, y + 12.5, "!", 12, "#ffffff", ' font-weight="900" text-anchor="middle"') + `<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="0.9s" repeatCount="indefinite"/></g></g>`;
  }
  function cardBox(L) {
    const pw = Math.min(L.W - 24, 420);
    const ph = 300;
    const px = Math.round((L.W - pw) / 2);
    const py = Math.round(Math.min(Math.max(12, L.H / 2 - ph / 2), L.H - ph - 12));
    return { px, py, pw, ph, sc: 7 };
  }
  function cardBg(L) {
    const { px, py, pw, ph, sc } = cardBox(L);
    return `<g id="cbg">` + r(0, 0, L.W, L.H, "#0d0a14", ' opacity="0.7"') + r(px + 3, py + 4, pw, ph, "#000", ' opacity="0.3" rx="8"') + r(px, py, pw, ph, "#1f1b2e", ' stroke="#4a4166" stroke-width="2" rx="8"') + r(px + 14, py + 18, 16 * sc + 8, 24 * sc - 8, "#2c3b5e", ' rx="6"') + r(px + 14, py + 18 + 24 * sc - 30, 16 * sc + 8, 22, "#24314f") + txt(px + pw - 12, py + ph - 10, t("card.close"), 8, "#8a83a8", ' text-anchor="end"') + `</g>`;
  }
  var aid = (s) => "a-" + s.replace(/[^a-z0-9-]/gi, "_");
  var cid = (s) => "c-" + s.replace(/[^a-z0-9-]/gi, "_");
  function card(L, type, w) {
    const awake = !!w?.isAwake;
    const isCeo = type === "claude";
    const status = isCeo ? t("status.boss") : awake ? t("status.working") : w?.justDone ? t("status.done") : t("status.sleeping");
    const role = roleOf(type) || (isCeo ? t("role.boss") : t("role.extra"));
    const body = [
      ...wrap(role, 34, 3),
      ...w?.level ? ["", ...wrap(t("card.power", { level: levelLabel(w.level), model: MODEL[w.level], effort: EFFORT[w.level] }), 34, 2), ...wrap(t("card.why", { reason: w.reason ?? "" }), 34, 2)] : [],
      "",
      ...wrap(t("card.now", { action: w?.action || (awake ? "\u2026" : "Zzz\u2026") }), 34, 5),
      ...w?.task ? ["", ...wrap(t("card.task", { task: w.task }), 34, 4)] : []
    ];
    const { px, py, sc } = cardBox(L);
    const tx = px + 16 * sc + 36;
    return `<g id="${cid(type)}" class="card"><use href="#cbg"/>` + person(type, px + 18, py + 14, awake || isCeo, sc, true) + txt(tx, py + 34, isCeo ? "Claude" : type, 15, "#ffffff", ' font-weight="700"') + txt(tx, py + 50, status, 9.5, awake || isCeo ? "#6ee7a0" : "#c9c3e0") + body.map((l, i) => txt(tx, py + 70 + i * 11.5, l, 9, "#e9e6f5")).join("") + `</g>`;
  }
  function scene(input) {
    const { ceo, now, pedido } = input;
    const byType = /* @__PURE__ */ new Map();
    for (const w of input.workers) {
      const cur = byType.get(w.type);
      if (!cur || w.isAwake || !cur.isAwake && w.startedAt >= cur.startedAt) byType.set(w.type, w);
    }
    const extras = [...byType.keys()].filter((tp) => !KNOWN.has(tp));
    const L = layout(input.wide, extras);
    const all = Object.keys(L.seats);
    const ceoPos = (at) => {
      const s = at ? L.seats[at] : void 0;
      if (!s) return L.ceoHome;
      const right = s.x + 48;
      return { x: right + SW <= L.W - 14 ? right : s.x - 46, y: s.y + 4 };
    };
    const css = `<style>.ag{cursor:pointer;outline:none}.ag .hl{opacity:0;transition:opacity .15s}.ag:hover .hl,.ag:focus .hl{opacity:1}.ag .nm{opacity:0;transition:opacity .15s}.ag:hover .nm,.ag:focus .nm,.ag.on .nm{opacity:1}.card{display:none}.bubble,.links,.fronts{pointer-events:none}` + [...all, "claude"].map((tp) => `#${aid(tp)}:focus~.cards #${cid(tp)}`).join(",") + `{display:inline}</style>`;
    let back = "";
    let roomFronts = "";
    for (const room of L.rooms) {
      const a = roomArt(room.kind, room.ox, room.oy, pedido);
      back += a.back;
      roomFronts += a.front;
    }
    const people = [];
    const fronts = [roomFronts];
    const links = [];
    const overlay = [];
    const cands = [];
    for (const tp of all) {
      const sp = L.seats[tp];
      const w = byType.get(tp);
      const awake = !!w?.isAwake;
      const lk = look(tp);
      if (sp.kind !== "stand") back += `<use href="#chair" x="${sp.x}" y="${sp.y}"/>`;
      const plateY = sp.y + (sp.kind === "desk" ? 72 : sp.kind === "table" ? 84 : SH + 12);
      const plateW = tp.length * 4.6 + 10;
      people.push(
        `<g id="${aid(tp)}" class="ag${awake ? " on" : ""}" tabindex="0"><title>${esc(tp)}</title>` + r(sp.x - 5, sp.y - 5, SW + 10, SH + 10, "none", ` class="hl" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 2" rx="4"`) + (sp.kind === "stand" ? `<ellipse cx="${sp.x + 16}" cy="${sp.y + SH}" rx="12" ry="3" fill="#00000030"/>` : "") + person(tp, sp.x, sp.y, awake) + `<g class="nm">${r(sp.x + 16 - plateW / 2, plateY - 9, plateW, 12, "#1f1830", ' opacity="0.85" rx="3"')}${txt(sp.x + 16, plateY, tp, 7.5, awake ? "#ffd166" : "#ffffff", ' text-anchor="middle"')}</g></g>`
      );
      if (sp.kind === "desk") {
        fronts.push(`<use href="#desk" x="${sp.x}" y="${sp.y}"/>` + (awake ? `<use href="#screen" x="${sp.x}" y="${sp.y}"/>` : "") + deskItems(tp, sp.x, sp.y));
        if (awake) {
          fronts.push(`<g>${r(sp.x + 6, sp.y + 32, 5, 4, lk.pal.S)}<animateTransform attributeName="transform" type="translate" values="0 0;0 -2;0 0" dur="0.25s" repeatCount="indefinite"/></g>`);
          fronts.push(`<g>${r(sp.x + 15, sp.y + 32, 5, 4, lk.pal.S)}<animateTransform attributeName="transform" type="translate" values="0 -2;0 0;0 -2" dur="0.25s" repeatCount="indefinite"/></g>`);
        } else {
          fronts.push(box(sp.x + 3, sp.y + 33, 26, 5, lk.pal.B) + r(sp.x + 12, sp.y + 34, 8, 3, lk.pal.S));
        }
      } else if (sp.kind === "table") {
        fronts.push(box(sp.x + 5, sp.y + 41, 22, 9, "#fbf8f1") + r(sp.x + 8, sp.y + 44, 14, 1, "#b8b2a4") + r(sp.x + 8, sp.y + 47, 10, 1, "#b8b2a4"));
        if (awake) fronts.push(box(sp.x + 6, sp.y + 30, 20, 12, "#9aa3ad") + r(sp.x + 8, sp.y + 32, 16, 8, "#7fd8ff"));
      }
      const headY = sp.y + (awake ? 0 : 3);
      if (awake && w) cands.push({ cx: sp.x + 16, headY, text: w.action, fill: "#ffffff", border: "#241b2f", prio: 2 + w.startedAt / 1e14, lines: 2 });
      else if (w?.justDone) cands.push({ cx: sp.x + 16, headY, text: w.action, fill: "#e3ffec", border: "#1f6b34", prio: 1, lines: 2 });
      else overlay.push(`<use href="#zz${hash(tp) % 3}" x="${sp.x}" y="${sp.y + 12}"/>`);
      if ((awake || w?.justDone) && w?.level) {
        overlay.push(`<g class="bubble">${r(sp.x + 26, sp.y + 2, 12, 12, LEVEL_COLOR[w.level], ` stroke="${OUT}" stroke-width="1.5" rx="3"`)}${txt(sp.x + 32, sp.y + 11, levelLabel(w.level)[0], 8, OUT, ' font-weight="700" text-anchor="middle"')}</g>`);
      }
      const f0 = w?.parentType ? L.seats[w.parentType] : void 0;
      if (awake && f0 && Math.hypot(f0.x - sp.x, f0.y - sp.y) < 230) {
        const f = f0;
        links.push(`<line x1="${f.x + 16}" y1="${f.y + 26}" x2="${sp.x + 16}" y2="${sp.y + 26}" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"><animate attributeName="stroke-dashoffset" values="16;0" dur="0.6s" repeatCount="indefinite"/></line>`);
      }
    }
    const to = ceoPos(ceo.at);
    const from = ceoPos(ceo.from);
    const walking = now - ceo.movedAt < 1800 && (from.x !== to.x || from.y !== to.y);
    const walk = walking ? `<animateTransform attributeName="transform" type="translate" from="${from.x - to.x} ${from.y - to.y}" to="0 0" dur="1.5s" fill="freeze"/>` : "";
    people.push(
      `<g id="${aid("claude")}" class="ag on" tabindex="0"><title>${esc(t("boss.title"))}</title><g>${walk}` + r(to.x - 5, to.y - 14, SW + 10, SH + 20, "none", ` class="hl" stroke="#ffd166" stroke-width="2" stroke-dasharray="4 2" rx="4"`) + `<ellipse cx="${to.x + 16}" cy="${to.y + SH}" rx="12" ry="3" fill="#00000030"/>` + person("claude", to.x, to.y, true) + r(to.x + 9, to.y - 5, 14, 5, "#ffd166", ` stroke="${OUT}" stroke-width="1"`) + r(to.x + 9, to.y - 9, 3, 4, "#ffd166") + r(to.x + 14.5, to.y - 10, 3, 5, "#ffd166") + r(to.x + 20, to.y - 9, 3, 4, "#ffd166") + r(to.x + 15, to.y - 3.5, 2, 2, "#e04848") + `<g class="nm">${r(to.x + 16 - 18, to.y + SH + 3, 36, 12, "#1f1830", ' opacity="0.85" rx="3"')}${txt(to.x + 16, to.y + SH + 12, "claude", 7.5, "#ffb08a", ' text-anchor="middle"')}</g></g></g>`
    );
    if (ceo.say) cands.push({ cx: to.x + 16, headY: to.y - 8, text: ceo.say, fill: "#fff1e8", border: "#a8462a", prio: 9, lines: 3 });
    const placed = [];
    const bubbles = [];
    for (const c of cands.sort((a, b) => b.prio - a.prio)) {
      const g = bubbleGeom(L.W, c);
      if (placed.some((p) => hits(p, g.rect))) {
        bubbles.push(alertSvg(c.cx, c.headY));
        continue;
      }
      placed.push(g.rect);
      bubbles.push(bubbleSvg(g.rect, g.lines, c));
    }
    const cards = `<g class="cards">` + all.map((tp) => card(L, tp, byType.get(tp))).join("") + card(L, "claude", { id: "ceo", type: "claude", task: pedido, action: ceo.say || "\u2026", isAwake: true, startedAt: 0 }) + `</g>`;
    const defs = `<defs>${PATTERNS}${ZZZ}${FURNITURE}${cardBg(L)}${symbols(["claude", ...all])}</defs>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.W} ${L.H}" width="${L.W * 3}" height="${L.H * 3}" shape-rendering="crispEdges" text-rendering="geometricPrecision">` + defs + css + r(0, 0, L.W, L.H, "#17131f") + back + `<g class="links">${links.join("")}</g>` + people.join("") + `<g class="fronts">${fronts.join("")}</g><g>${overlay.join("")}${bubbles.join("")}</g>` + cards + `</svg>`;
  }

  // web/page.ts
  var $ = (id) => document.getElementById(id);
  var esc2 = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  var usd = (v) => v >= 100 ? "$" + v.toFixed(0) : v >= 1 ? "$" + v.toFixed(2) : v >= 0.01 ? "$" + v.toFixed(3) : "$" + v.toFixed(4);
  var k = (n) => n >= 1e9 ? (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(Math.round(n));
  var ago = (ts) => {
    const s = Math.max(0, (Date.now() - ts) / 1e3);
    return s < 60 ? t("ago.now") : s < 3600 ? t("ago.min", { n: Math.floor(s / 60) }) : s < 86400 ? t("ago.h", { n: Math.floor(s / 3600) }) : t("ago.d", { n: Math.floor(s / 86400) });
  };
  var pct = (real, base) => base > 0 ? Math.max(0, (1 - real / base) * 100) : 0;
  var view = "office";
  var fromUrl = new URLSearchParams(location.search).get("s") || "";
  var current2 = fromUrl;
  var sessions = [];
  var mode = "equilibrado";
  var lastStateText = "";
  var lastKey = "";
  var usage = null;
  var langSet = false;
  function applyStatic() {
    document.documentElement.lang = t("ago.now") === "agora" ? "pt-BR" : t("ago.now") === "ahora" ? "es" : "en";
    document.title = BRAND;
    $("brand").textContent = `\u{1F3D9}\uFE0F ${BRAND}`;
    $("tabOffice").textContent = t("tab.office");
    $("tabTokens").textContent = t("tab.tokens");
    $("chatsTitle").textContent = t("chats.title");
    $("modesTitle").textContent = t("modes.title");
    $("modeToggle").title = t("modes.collapse");
    drawModes();
    drawChats();
  }
  setLang(pickLang(navigator.language));
  document.querySelectorAll(".tab").forEach(
    (b) => b.addEventListener("click", () => {
      view = b.dataset.view === "tokens" ? "tokens" : "office";
      document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x === b));
      $("view-office").classList.toggle("on", view === "office");
      $("view-tokens").classList.toggle("on", view === "tokens");
      if (view === "tokens") void loadUsage();
      else {
        lastKey = "";
        redrawOffice();
      }
    })
  );
  function drawModes() {
    $("modeButtons").innerHTML = MODE_LIST.map(
      (m) => `<button class="mode${m === mode ? " on" : ""}" data-mode="${m}"><b>${esc2(modeLabel(m))}</b><span>${esc2(modeShort(m))}</span></button>`
    ).join("");
    $("modeHint").textContent = modeHint(mode);
  }
  $("modeButtons").addEventListener("click", async (ev) => {
    const m = ev.target.closest("button")?.getAttribute("data-mode");
    if (!isMode(m)) return;
    mode = m;
    drawModes();
    try {
      await fetch("/mode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: m }) });
    } catch {
      $("status").textContent = t("err.mode");
    }
  });
  $("modeToggle").addEventListener("click", () => {
    const min = $("modes").classList.toggle("min");
    $("modeToggle").textContent = min ? "\u25B4" : "\u25BE";
  });
  function drawChats() {
    if (!sessions.length) {
      $("chats").innerHTML = `<div class="note">${esc2(langSet ? t("chats.none") : t("chats.loading"))}</div>`;
      return;
    }
    $("chats").innerHTML = sessions.map((s) => {
      const badges = (s.live ? `<span class="badge">${esc2(t("chats.live"))}</span>` : "") + (s.awake ? `<span class="badge busy">${esc2(t("chats.busy", { n: s.awake }))}</span>` : "");
      return `<button class="chat${s.id === current2 ? " on" : ""}" data-id="${esc2(s.id)}"><span class="t">${esc2(s.title || t("chats.untitled"))}${badges}</span><span class="m">${esc2(s.project || t("chats.noFolder"))} \xB7 ${ago(s.updatedAt)}</span></button>`;
    }).join("");
  }
  $("chats").addEventListener("click", (ev) => {
    const id = ev.target.closest("button")?.getAttribute("data-id");
    if (id) selectChat(id);
  });
  function selectChat(id) {
    current2 = id;
    history.replaceState(null, "", `?s=${encodeURIComponent(id)}`);
    lastStateText = "";
    drawChats();
    void loadState();
    if (view !== "office") document.querySelector('.tab[data-view="office"]').click();
  }
  async function loadSessions() {
    try {
      const r2 = await (await fetch("/api/sessions", { cache: "no-store" })).json();
      if (!langSet && r2.locale) {
        setLang(pickLang(r2.locale));
        langSet = true;
        lastKey = "";
        applyStatic();
        redrawOffice();
      }
      sessions = r2.sessions ?? [];
      if (isMode(r2.mode) && r2.mode !== mode) {
        mode = r2.mode;
        drawModes();
      }
      if (!current2 || !sessions.some((s) => s.id === current2) && current2 !== fromUrl) current2 = (sessions.find((s) => s.live) ?? sessions[0])?.id ?? "";
      drawChats();
      const live = sessions.filter((s) => s.live).length;
      const base = usage ? usage.today.opus + (usage.rtk?.summary?.total_saved ?? 0) * 4 / 1e6 : 0;
      $("liveHead").innerHTML = `<span class="dot"></span>${esc2(live === 1 ? t("head.live1") : t("head.live", { n: live }))}` + (usage ? ` \xB7 ${esc2(t("head.saving"))} <b>\u2212${pct(usage.today.real, base).toFixed(1)}%</b>` : "");
      $("status").textContent = "";
    } catch {
      $("status").textContent = t("err.server");
    }
  }
  async function loadState() {
    if (!current2 || view !== "office") return;
    try {
      const text = await (await fetch(`/api/state?s=${encodeURIComponent(current2)}`, { cache: "no-store" })).text();
      if (text !== lastStateText) {
        lastStateText = text;
        redrawOffice();
      }
    } catch {
    }
  }
  function redrawOffice() {
    if (!lastStateText) return;
    const box2 = $("office").getBoundingClientRect();
    const wide = box2.width / Math.max(1, box2.height) > 1;
    const key = lastStateText + "|" + wide;
    if (key === lastKey) return;
    lastKey = key;
    const st = JSON.parse(lastStateText);
    const focused = document.activeElement?.id;
    $("office").innerHTML = scene({
      workers: st.workers ?? [],
      ceo: st.ceo ?? { from: "", at: "", movedAt: 0, say: "" },
      pedido: st.pedido ?? "",
      now: Date.now(),
      wide
    });
    const svg = $("office").querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
    }
    if (focused) document.getElementById(focused)?.focus?.();
  }
  window.addEventListener("resize", () => {
    lastKey = "";
    redrawOffice();
  });
  async function loadUsage() {
    try {
      usage = await (await fetch("/api/usage", { cache: "no-store" })).json();
      if (view === "tokens") drawTokens();
    } catch {
    }
  }
  function lineChart(mins) {
    const W = 640, H = 200, L = 46, B = 22, T = 10;
    let r2 = 0, n = 0;
    const real = mins.map((m) => r2 += m.real);
    const norm = mins.map((m) => n += m.opus);
    const max = Math.max(n, 1e-4);
    const x = (i) => L + i / (mins.length - 1) * (W - L - 8);
    const y = (v) => T + (1 - v / max) * (H - T - B);
    const path = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
    const area = (arr) => `${path(arr)}L${x(arr.length - 1)},${y(0)}L${x(0)},${y(0)}Z`;
    let grid2 = "";
    for (let g = 0; g <= 4; g++) {
      const v = max * g / 4;
      grid2 += `<line x1="${L}" x2="${W - 8}" y1="${y(v)}" y2="${y(v)}" stroke="#ffffff10"/><text x="${L - 6}" y="${y(v) + 3}" font-size="10" fill="#8f88ad" text-anchor="end">${usd(v)}</text>`;
    }
    for (const m of [0, 15, 30, 45, 59]) grid2 += `<text x="${x(m)}" y="${H - 6}" font-size="10" fill="#8f88ad" text-anchor="middle">${m === 59 ? esc2(t("c.now")) : `-${59 - m}m`}</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" shape-rendering="geometricPrecision">${grid2}<path d="${area(norm)}" fill="#5b547055"/><path d="${path(norm)}" fill="none" stroke="#8f88ad" stroke-width="2"/><path d="${area(real)}" fill="#7CFC9A33"/><path d="${path(real)}" fill="none" stroke="#7CFC9A" stroke-width="2.5"/><circle cx="${x(mins.length - 1)}" cy="${y(r2)}" r="4" fill="#7CFC9A"><animate attributeName="r" values="3;6;3" dur="1.4s" repeatCount="indefinite"/></circle></svg>`;
  }
  function barChart(days) {
    const W = 640, H = 200, L = 46, B = 22, T = 10;
    const max = Math.max(...days.map(([, d]) => d.opus), 1e-4);
    const bw = (W - L - 8) / days.length;
    const y = (v) => T + (1 - v / max) * (H - T - B);
    let g = "";
    for (let i = 0; i <= 4; i++) {
      const v = max * i / 4;
      g += `<line x1="${L}" x2="${W - 8}" y1="${y(v)}" y2="${y(v)}" stroke="#ffffff10"/><text x="${L - 6}" y="${y(v) + 3}" font-size="10" fill="#8f88ad" text-anchor="end">${usd(v)}</text>`;
    }
    days.forEach(([key, d], i) => {
      const x0 = L + i * bw;
      g += `<rect x="${x0 + 3}" y="${y(d.opus)}" width="${bw / 2 - 3}" height="${y(0) - y(d.opus)}" fill="#5b5470"><title>${key} \xB7 ${esc2(t("c.normal"))} ${usd(d.opus)}</title></rect>`;
      g += `<rect x="${x0 + bw / 2}" y="${y(d.real)}" width="${bw / 2 - 3}" height="${y(0) - y(d.real)}" fill="#7CFC9A"><title>${key} \xB7 ${esc2(t("c.real"))} ${usd(d.real)} (\u2212${pct(d.real, d.opus).toFixed(1)}%)</title></rect>`;
      g += `<text x="${x0 + bw / 2}" y="${H - 6}" font-size="10" fill="#8f88ad" text-anchor="middle">${key.slice(8)}/${key.slice(5, 7)}</text>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${g}</svg>`;
  }
  function drawTokens() {
    const u = usage;
    if (!u) return;
    const td = u.today;
    const rtkSaved = u.rtk?.summary?.total_saved ?? 0;
    const rtkValue = rtkSaved * 4 / 1e6;
    const modelSave = Math.max(0, td.opus - td.real);
    const saved = modelSave + rtkValue;
    const baseline = td.opus + rtkValue;
    const cacheSave = Math.max(0, td.normal - td.opus);
    const inTotal = td.input + td.cacheRead + td.cacheWrite;
    const hit = inTotal > 0 ? td.cacheRead / inTotal * 100 : 0;
    const days = Object.entries(u.days);
    const models = Object.entries(u.byModel).sort((a, b) => b[1].real - a[1].real);
    const who = (key) => key.replace(" \xB7 chefe", ` \xB7 ${t("who.lead")}`).replace(" \xB7 agentes", ` \xB7 ${t("who.agents")}`);
    const kpi = (title, v, s, color = "var(--ink)") => `<div class="tile kpi"><h2>${esc2(title)}</h2><div class="v" style="color:${color}">${v}</div><div class="s">${esc2(s)}</div></div>`;
    const none = (cols) => `<tr><td colspan="${cols}" class="note">${esc2(t("c.nothing"))}</td></tr>`;
    $("view-tokens").innerHTML = kpi(t("k.saving"), `\u2212${pct(td.real, baseline).toFixed(1)}%`, t("k.savingSub", { x: usd(saved) }), "var(--good)") + kpi(t("k.real"), usd(td.real), t("k.realSub", { n: td.msgs })) + kpi(t("k.normal"), usd(baseline), t("k.normalSub"), "var(--dim)") + kpi(t("k.tokens"), k(td.tokens), t("k.tokensSub", { o: k(td.output), i: k(td.input) })) + kpi(t("k.rate"), `${k(u.rate)}/min`, t("k.rateSub"), "var(--warn)") + kpi(t("k.cache"), `${hit.toFixed(0)}%`, t("k.cacheSub", { x: k(td.cacheRead) })) + `<div class="tile wide"><h2>${esc2(t("c.live"))}</h2>${lineChart(u.minutes)}<div class="legend"><span><i style="background:#8f88ad"></i>${esc2(t("c.normal"))}</span><span><i style="background:#7CFC9A"></i>${esc2(t("c.real"))}</span><span>${esc2(t("c.every"))}</span></div></div><div class="tile side"><h2>${esc2(t("c.where"))}</h2><div class="split"><div style="width:${saved > 0 ? modelSave / saved * 100 : 0}%;background:#7CFC9A"></div><div style="width:${saved > 0 ? rtkValue / saved * 100 : 0}%;background:#ffd34d"></div></div><table><tr><td><span class="badge" style="margin:0 6px 0 0"></span>${esc2(t("c.model"))}</td><td class="n">${usd(modelSave)}</td></tr><tr><td><span class="badge busy" style="margin:0 6px 0 0"></span>${esc2(t("c.rtk", { x: k(rtkSaved) }))}</td><td class="n">${usd(rtkValue)}</td></tr><tr><td style="color:var(--dim)">${esc2(t("c.cache"))}</td><td class="n" style="color:var(--dim)">${usd(cacheSave)}</td></tr></table><div class="note">${esc2(t("c.whereNote"))}</div></div><div class="tile half"><h2>${esc2(t("c.days", { n: days.length }))}</h2>${barChart(days)}<div class="legend"><span><i style="background:#5b5470"></i>${esc2(t("c.normal"))}</span><span><i style="background:#7CFC9A"></i>${esc2(t("c.real"))}</span></div></div><div class="tile half"><h2>${esc2(t("c.byModel"))}</h2><table><tr><th>${esc2(t("c.modelWho"))}</th><th class="n">${esc2(t("c.tokens"))}</th><th class="n">${esc2(t("c.real"))}</th><th class="n">${esc2(t("c.normal"))}</th></tr>` + (models.length ? models.map(([m, a]) => `<tr><td>${esc2(who(m))}</td><td class="n">${k(a.tokens)}</td><td class="n">${usd(a.real)}</td><td class="n">${usd(a.opus)}</td></tr>`).join("") : none(4)) + `</table></div><div class="tile full"><h2>${esc2(t("c.topChats"))}</h2><table><tr><th>${esc2(t("c.chat"))}</th><th class="n">${esc2(t("c.tokens"))}</th><th class="n">${esc2(t("c.real"))}</th><th class="n">${esc2(t("c.normal"))}</th><th class="n">${esc2(t("c.saving"))}</th></tr>` + (u.topSessions.length ? u.topSessions.map((s) => `<tr class="link" data-id="${esc2(s.id)}"><td>${esc2(s.title || t("chats.untitled"))}</td><td class="n">${k(s.tokens)}</td><td class="n">${usd(s.real)}</td><td class="n">${usd(s.opus)}</td><td class="n" style="color:var(--good)">\u2212${pct(s.real, s.opus).toFixed(1)}%</td></tr>`).join("") : none(5)) + `</table><div class="note">${esc2(t("c.foot"))}</div></div>`;
  }
  $("view-tokens").addEventListener("click", (ev) => {
    const id = ev.target.closest("tr.link")?.getAttribute("data-id");
    if (id) selectChat(id);
  });
  window.addEventListener("keydown", (e) => {
    if (e.target.closest("input,textarea")) return;
    if (e.key === "f" || e.key === "F") {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen();
    }
  });
  applyStatic();
  void loadSessions().then(loadState);
  setInterval(loadSessions, 3e3);
  setInterval(loadState, 700);
  setInterval(() => void loadUsage(), 2e3);
  void loadUsage();
})();
