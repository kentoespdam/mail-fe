---
name: implement-crud
description: CRUD implementation using Orchestrated Hook pattern.
tools: Read, Write, Bash
---

# CRUD Protocol (Ref: .claude/SKILL/implement-crud/patterns.md)

## 1. Structural Contract
- **Types:** `src/types/{f}.ts` (Schema, Payload, DTO, Page interface).
- **API:** `src/lib/{f}-api.ts` (CRUD fetchers via `/api/proxy/`).
- **Hooks:** `src/hooks/{f}-hooks.tsx` (Logic: `use{F}s`, `use{F}Mutations`, `use{F}Content`).
- **UI:** `src/components/{f}/` (Form, Delete, Content/DataTable).

## 2. Orchestrator Logic (use{F}Content)
- Satukan state: `page`, `size`, `data`, `isLoading`, dan `modals` (create/edit/del).
- Memoize `columns` di dalam hook ini.

## 3. Implementation Step
1. Baca `patterns.md` untuk melihat template kode terbaru.
2. Generate boilerplate berdasarkan `{F}` (Pascal) dan `{f}` (kebab).
3. Pastikan UI menggunakan **Bahasa Indonesia** dan tombol memiliki **pending state**.