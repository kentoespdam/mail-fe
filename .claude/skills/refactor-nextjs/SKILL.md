---
name: refactor-nextjs
description: Modernize to Next.js 16, React 19, Biome, and Tailwind v4.
tools: Read, Write, Bash, Glob
---

# Next.js 16 Refactor Protocol

## 1. Core Standards
| Feature | Requirement |
| :--- | :--- |
| **Tooling** | **Bun** (no npm), **Biome** (Tabs, no ESLint/Prettier). |
| **Styling** | **Tailwind v4** (OKLch in `globals.css`). No `tailwind.config`. |
| **Color Rule** | **60-30-10**: 60% Neutral (BG), 30% Secondary (Muted), 10% Accent (Primary). |
| **Imports** | `@/*` alias. Order: React -> Next -> Libs -> Components -> Types. |

## 2. React 19 & UI Modernization
- **Compiler:** Remove manual `useMemo`/`useCallback` (let `babel-plugin-react-compiler` handle it).
- **State/Data:** **TanStack Query v5** (Client), Server Components (Initial Fetch), **Zustand** (Global).
- **Forms:** `react-hook-form` + `zod` + `@hookform/resolvers`.
- **UI Kit:** `@base-ui/react` + **shadcn** (base-mira). Use **CVA** for variants.
- **Icons:** `@tabler/icons-react` or `@hugeicons/react`.

## 3. Architecture Mapping
- **Logic:** `src/actions/` (Mutations/Auth), `src/lib/dal.ts` (Data Access/Caching).
- **Auth:** `jose` (JWT) in `src/lib/session.ts`. Use encrypted `token` cookie.
- **Utils:** `src/lib/utils.ts`, `src/lib/constants.ts`.
- **Types:** `src/types/`. Use `interface` (objects) and `type` (unions).
- **UX:** `next-themes` (Dark mode), `sonner` (Toasts), `date-fns` (Dates).
- **Tables:** `@tanstack/react-table`.

## 4. Execution Workflow
1. **Analyze:** Check `biome.json` and `tsconfig.json` for compliance.
2. **Lint:** `bun run lint` to find Biome violations.
3. **Transform:** Apply `Write` changes (enforce Tabs).
4. **Verify:** - `bun run format` (auto-fix).
   - `bun run build` (critical: check types & Next 16 patterns).
5. **Report:** List changes and any `bun add` performed.

✅ **Refactor Complete**