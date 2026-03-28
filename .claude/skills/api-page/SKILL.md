---
name: api-page
description: Generate a full CRUD page from an OpenAPI/Swagger endpoint. Use when the user asks to create a page for an API controller, build a CRUD UI, or scaffold pages from API docs.
argument-hint: <api-docs-url> [controller-name]
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash, WebFetch
---

Generate a complete CRUD page from an OpenAPI spec. The user will provide an API docs URL and optionally a controller name to focus on.

## Steps

1. **Fetch & parse the OpenAPI spec** from `$ARGUMENTS` (first arg = URL, second arg = controller/tag name). Use `curl` via Bash since the URL is likely HTTP. Extract all endpoints, request/response schemas, and parameters for the target controller.

2. **Read project conventions** before writing any code:
   - Read `CLAUDE.md` and `AGENTS.md` for stack info and patterns
   - Read existing examples to match the project style:
     - `src/app/login/page.tsx` — server component page pattern (thin, imports client component)
     - `src/components/auth/login-form.tsx` — client component pattern (uses hook for logic)
     - `src/hooks/auth-hooks.tsx` — hook pattern (form + mutation + toast)
     - `src/lib/publication-api.ts` — API client pattern (fetch via `/api/proxy/*`)
     - `src/types/publication.ts` — type/schema pattern (zod v4 + interfaces)
     - `src/components/publication/` — component split pattern

3. **Generate files** following this structure:

   ```
   src/types/<feature>.ts              — Zod schemas + TS interfaces for DTOs
   src/lib/<feature>-api.ts            — API client functions (via /api/proxy/*)
   src/hooks/<feature>-hooks.tsx        — TanStack Query hooks (useList, useCreate, useUpdate, useDelete)
   src/components/<feature>/            — Client components split by function:
     <feature>-content.tsx              — Main orchestrator (state, filters, pagination)
     <feature>-table.tsx                — Table display component
     <feature>-form-dialog.tsx          — Create/Edit dialog with shared form fields
     <feature>-delete-dialog.tsx        — Delete confirmation dialog
   src/app/(main)/<route>/page.tsx      — Server component (thin wrapper)
   ```

4. **Apply these rules:**
   - **Server/client split**: `page.tsx` is a server component that only imports the client `*-content.tsx`
   - **Logic in hooks**: All data fetching, mutations, form setup, and toasts live in hooks — components are presentational
   - **Zod schemas**: Use `z.string()`, `z.number()`, `z.boolean()` — avoid `z.coerce.*()` (causes type mismatch with react-hook-form resolver). Use `{ valueAsNumber: true }` in `register()` for number fields instead
   - **API client**: All fetches go through `/api/proxy/*` which the proxy middleware forwards with auth headers
   - **Multipart uploads**: Use `FormData` with `Blob` for JSON data part + file part (match Spring `@RequestPart` pattern)
   - **Form submission**: Use `form.trigger()` + `form.getValues()` instead of `form.handleSubmit()` to avoid React Compiler generic type erasure issues
   - **Indonesian UI text**: All labels, toasts, error messages, and button text in Bahasa Indonesia
   - **Dynamic route**: Add `export const dynamic = "force-dynamic"` to page.tsx to prevent static prerender errors from QueryClient
   - **Protected route**: Add the new route prefix to `PROTECTED_PREFIXES` in `src/proxy.ts`
   - **Menu link**: Add navigation item in `src/components/dashboard/top-menu.tsx`
   - **CUD for admin only**: Create, Update, Delete actions should be clearly separated and admin-gated

5. **UI components available** (do NOT create new UI primitives):
   - `@/components/ui/button` — Button with variants (default, outline, ghost, destructive) and sizes
   - `@/components/ui/input` — Input (text, number, file, etc.)
   - `@/components/ui/card` — Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter
   - `@/components/ui/table` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
   - `@/components/ui/dialog` — Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
   - `@/components/ui/field` — Field, FieldGroup, FieldLabel, FieldError
   - `@/components/ui/badge` — Badge with variants
   - `@/components/ui/select` — Select, SelectTrigger, SelectValue, SelectContent, SelectItem
   - `@/components/ui/separator`, `@/components/ui/tooltip`, `@/components/ui/label`
   - Icons: `@tabler/icons-react`, `@phosphor-icons/react`

6. **Build & verify**: Run `bun run build` after generating all files. Fix any type errors or build failures.

## Reference

See [patterns.md](patterns.md) for detailed code patterns and examples.
