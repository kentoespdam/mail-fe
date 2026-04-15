# SmartOffice Mail Service - Frontend

Next.js 16 (App Router, React 19) frontend for the SmartOffice Mail Service migration, focusing on a modern, responsive, and type-safe user interface.

## Project Overview

- **Core Tech:** Next.js 16.2.2, React 19, TypeScript 5, Bun runtime.
- **Styling:** Tailwind CSS v4 (OKLch color system), shadcn v4 + Base UI.
- **State Management:** TanStack Query v5 (server state), Zustand v5 (client state), `useQueryState` for URL-bound state.
- **Data Handling:** TanStack Table v8, React Hook Form v7 + Zod v4.
- **Auth:** Appwrite + jose (JWT session management via `src/proxy.ts`).
- **Development Tools:** Biome for linting and formatting.

## Architecture & Conventions

### Directory Structure
- `src/app/(main)`: Protected routes requiring authentication.
- `src/components/builder`: Standardized form controller wrappers (e.g., `InputTextControll`).
- `src/components/ui`: Atomic shadcn and base UI components.
- `src/hooks`: Custom hooks like `useQueryState` for synchronizing state with URL params.
- `src/lib`: API clients, session management, and utility functions.
- `src/proxy.ts`: NextProxy layer handling route protection, JWT refresh, and API rewriting.

### Key Patterns
- **API Proxying:** Frontend calls go to `/api/proxy/*`, which are rewritten to `API_BASE_URL` with auto-injected Bearer tokens.
- **Form Pattern:** Use `builder/` components which wrap `Controller` from React Hook Form. Structure: `FieldGroup > Controller > Field > FieldLabel + Input + FieldError`.
- **URL State:** Prefer `useQueryState` for pagination, sorting, and filtering to ensure deep-linkable UI states.
- **Localization:** All UI text must be in **Bahasa Indonesia**.
- **Documentation:** Follow ADRs in `docs/architecture.md`. Root instructions are indexed; specific modules may have their own `CLAUDE.md`.

## Building and Running

### Development
```bash
bun install    # Install dependencies
bun dev        # Start development server
```

### Quality & Production
```bash
bun run lint      # Run Biome linting and auto-fix
bun run format    # Run Biome formatting
bun run build     # Create production build
bun run start     # Run production server
```

## Environment Variables
Ensure the following are set in your `.env` file (refer to `README.md` for details):
- `API_BASE_URL`: Backend Spring Boot API endpoint.
- `APPWRITE_ENDPOINT` / `APPWRITE_PROJECT_ID`: Auth configuration.
- `SESSION_SECRET`: Secret for session encryption.

## Coding Standards
- **Imports:** Prefer absolute imports starting with `@/`.
- **Typing:** Strict TypeScript usage. Avoid `any`. Define interfaces in `src/types/`.
- **Components:** Functional components with `use client` or `server-only` pragmas as appropriate.
- **Linting:** Biome is the source of truth for code style. Never bypass linting on commit.
