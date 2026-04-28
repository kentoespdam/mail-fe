# CLAUDE.md

## Commands
```bash
bun dev          # Dev server
bun run build    # Build
bun run lint     # Biome lint
bun run format   # Biome fix
```

## Tech Stack
Next.js 16.2.1 (App Router, React 19), Bun, TypeScript 5, Biome (tabs), Tailwind v4 (OKLch), shadcn v4 + base-ui, TanStack Query v5, Zustand v5, RHF + Zod v4, Appwrite + jose (JWT), NextProxy.

## Conventions
- **Path Alias:** `@/*` → `./src/*`
- **API Proxy:** `/api/proxy/*` → `API_BASE_URL` (Bearer auto-injected by middleware)
- **Auth:** `src/proxy.ts` (NextProxy) handles route protection, JWT refresh, API proxy
- **Forms:** `FieldGroup > Controller > Field > FieldLabel + Input + FieldError`, builder components accept `form` (UseFormReturn)
- **Routing:** Protected routes inside `(main)` group
- **UX:** All UI text, errors, toasts in Bahasa Indonesia
- **API docs:** `apidocs/` directory (core, master)

## Env Vars
`API_BASE_URL`, `APPWRITE_HOSTNAME`, `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, `DEFAULT_MAIL_DOMAIN`, `SESSION_SECRET`

## Memory
Setelah menyelesaikan tugas (implement fitur, fix bug, refactor, dll), **selalu update memory** di `/home/dev/.claude/projects/-mnt-DATA-html-mail-fe/memory/`:
- Update `MEMORY.md` index jika ada route/feature baru
- Buat/update feature file jika ada fitur baru atau perubahan signifikan
- Update layer files jika ada perubahan arsitektur/pattern


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
