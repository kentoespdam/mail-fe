---
name: code-review
description: Pre-merge security, performance, and bug audit.
tools: Read, Glob, Grep, Bash
---

# PR Review Protocol: Production-Ready Only

## 1. Analysis
- **Scope:** `git diff HEAD~1` to identify all modified files and impacted APIs.
- **Context:** Read changed files entirely to map side effects.

## 2. Security & Integrity (Grep/Manual)
- **Leaks:** No hardcoded secrets, tokens, or `console.log`/debug leftovers.
- **Validation:** Strict **Zod** schemas for all inputs.
- **Vulnerabilities:** No raw SQL (injection risk) or `dangerouslySetInnerHTML`.

## 3. Performance Audit
- **React:** Proper use of `React.memo`, `useMemo`, and `useCallback` to prevent re-renders.
- **Assets:** `next/image` with correct `sizes`. Canvas must use `requestAnimationFrame`.
- **Bloat:** Evaluate bundle size impact of new dependencies.

## 4. Reporting & Validation
- **Format:** Categorize as `CRITICAL`, `WARNING`, or `SUGGESTION`.
- **Hard Gate:** Block merge on `CRITICAL`. Mandatory `bun run build` check before approval.
- **Completion:** End with "✅ **Ready**".