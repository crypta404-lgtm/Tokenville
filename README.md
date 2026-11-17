# 🏙️ Tokenville

**Your Claude Code subagents as a living pixel-art office — with automatic power levels, savings modes and a live Token Meter.**

Every chat becomes an office. When Claude calls a subagent, that character wakes up at its desk and a speech bubble says exactly what it is doing ("Reading server.mjs", "Searching the web: …"). The lead (Claude, with a crown) walks over to whoever it called. Click any character to zoom in and see its role, power level, current action and task.

> 🇧🇷 [Leia em português](#-português)

## Features

- **Pixel-art office** — four rooms (Planning, Dev, Quality, Support + Café), chibi characters, desks, monitors, plants, window light. Sleeping agents snore (`z z z`), working ones type and blink.
- **No overlapping bubbles** — when bubbles would collide, the lower-priority one becomes a pulsing red **!** (click the character to read it).
- **Your real chats in the sidebar** — read from Claude Code's own session logs; click one to see its office.
- **Automatic power levels** — each subagent gets Low (Haiku), Medium (Sonnet) or High (Opus) plus a matching `effort`, based on its role and the task.
- **Savings modes** (bottom-right corner):
  - **ULTRA SAVER** — everything on Low, terse "caveman" answers, low effort even for the lead.
  - **Saver** — only Low and Medium.
  - **Balanced** — automatic.
  - **Maximum** — Medium and High.
- **📊 Token Meter** — real token usage read from Claude Code's logs, live (updates every 2 s): cost vs. "if it were normal" (everything on Opus), savings by source, last 14 days, by model, top chats.
- **Speaks your language** — follows the operating system's language (English, Português, Español; others fall back to English).
- **Nothing pops up** — the local page server starts hidden (no terminal windows).

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install tokenville --marketplace crypta404-lgtm/tokenville
```

Answer `y` to add the marketplace, then pick a scope (user scope is recommended).

From a shell:

```bash
claude plugin install tokenville --marketplace crypta404-lgtm/tokenville
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `crypta404-lgtm/tokenville`, then **Add plugin**.

Then open a new session and run `/tokenville`, or open **http://localhost:4747** in your browser (press **F** for full screen).

### Requirements

- Claude Code with plugin mods (hooks modules) support.
- [Node.js](https://nodejs.org) 18+ on your `PATH` (runs the local page server).

### Recommended (optional)

Tokenville seats 20 well-known agents. Install agents with these names (for example from [wshobson/agents](https://github.com/wshobson/agents)) into `~/.claude/agents/`, plus a planner agent named `planejador`:

`planejador`, `backend-architect`, `database-architect`, `ui-ux-designer`, `typescript-pro`, `javascript-pro`, `python-pro`, `frontend-developer`, `sql-pro`, `ai-engineer`, `prompt-engineer`, `code-reviewer`, `test-automator`, `security-auditor`, `performance-engineer`, `debugger`, `error-detective`, `search-specialist`, `deployment-engineer`, `docs-architect`.

Any other agent type still shows up, standing in the Planning room.

The savings modes work best together with these tools (all optional, installed separately): [rtk](https://github.com/rtk-ai/rtk), [caveman](https://github.com/JuliusBrussee/caveman), [context-mode](https://github.com/mksglu/context-mode), [Serena](https://github.com/oraios/serena), [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp), [claude-mem](https://github.com/thedotmack/claude-mem), [headroom](https://github.com/chopratejas/headroom).

### Start the page with Windows (optional)

The plugin starts the page server whenever a Claude Code session starts. To have it ready right after you log in, put a shortcut in your Startup folder (`Win + R` → `shell:startup`) that runs:

```
wscript.exe //B //NoLogo "%USERPROFILE%\.claude\tokenville\start-hidden.vbs"
```

## How it works

| Piece | What it does |
|---|---|
| `hooks/register.tsx` | The mod: listens to subagent spawns, tool calls and turns; picks power levels; writes each chat's office state to `~/.claude/tokenville/sessions/`. |
| `hooks/power.ts` | Power levels, modes and the (English) instructions sent to the model in Saver / ULTRA modes. |
| `hooks/scene.ts` | Draws the pixel-art office as SVG (no JavaScript inside). |
| `hooks/i18n.ts` | All visible text, per language. |
| `web/server.mjs` | Local server on `127.0.0.1:4747` (never exposed to the network). Reads Claude Code's logs for the chat list and the Token Meter. No dependencies. |
| `web/page.ts` → `web/office.js` | The page (Office + Token Meter). Rebuild with `npx esbuild web/page.ts --bundle --format=iife --outfile=web/office.js`. |

**Privacy:** everything stays on your machine. The server only listens on `127.0.0.1` and only reads local files. The page loads the *Pixelify Sans* and *Inter* fonts from Google Fonts; without internet it falls back to system fonts.

**About the savings numbers:** "normal" means everything on Opus *with* the prompt cache Claude Code already uses. Only what Tokenville really saves is counted (cheaper models for the right tasks, and rtk's filtered tokens). Savings from caveman, context-mode or claude-mem are not counted, because there is no honest way to measure "without them". Values are shown at equivalent API prices; on a subscription plan they translate into extra usage.

## License

[PolyForm Noncommercial 1.0.0](LICENSE) — Copyright (c) 2026 CrYpta404.

Free to use, study, modify and share for **any noncommercial purpose** (personal use, hobby projects, research, education, nonprofit organizations). **Commercial use is not allowed** — selling it, bundling it into a paid product or service, or using it to make money requires the author's permission.

---

## 🇧🇷 Português

**Seus subagentes do Claude Code como um escritório em pixel art — com níveis de potência automáticos, modos de economia e um Tokenômetro ao vivo.**

Cada chat vira um escritório. Quando o Claude chama um subagente, o personagem acorda na mesa e um balão diz exatamente o que ele está fazendo. O chefe (Claude, de coroa) vai até quem ele chamou. Clique em qualquer personagem para dar zoom e ver a função, o nível de potência, o que está fazendo e a tarefa.

- **Balões sem conflito:** quando dois balões se chocariam, o de menor prioridade vira uma **!** vermelha.
- **Seus chats reais** na lateral, lidos dos registros do próprio Claude Code.
- **Níveis de potência automáticos:** Baixo (Haiku), Médio (Sonnet) ou Alto (Opus) por agente, conforme a função e a tarefa.
- **Modos** no canto inferior direito: ULTRA ECONOMIA, Econômico, Equilibrado e Máximo.
- **📊 Tokenômetro:** uso real de tokens, ao vivo, comparado com "se fosse normal".
- **No idioma do seu sistema** (português, inglês ou espanhol).

### Instalar

No prompt de uma sessão do Claude Code no terminal:

```
/plugin install tokenville --marketplace crypta404-lgtm/tokenville
```

Responda `y` para adicionar o marketplace e escolha o escopo (usuário é o recomendado). No app desktop: clique em **+** ao lado da caixa de mensagem, depois **Plugins**, **Add marketplace** com `crypta404-lgtm/tokenville` e **Add plugin**.

Depois abra uma sessão nova e rode `/tokenville`, ou abra **http://localhost:4747** (tecla **F** = tela cheia). Precisa do [Node.js](https://nodejs.org) 18+ instalado.

### Licença

[PolyForm Noncommercial 1.0.0](LICENSE) — Copyright (c) 2026 CrYpta404. **Uso livre para fins não comerciais** (pessoal, hobby, estudo, pesquisa, educação, organizações sem fins lucrativos). **Uso comercial não é permitido** sem autorização do autor.
