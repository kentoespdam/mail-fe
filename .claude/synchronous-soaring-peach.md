# Update Mail Type Lookup to Match API Schema

## Context
The API `MailTypeLookup` schema returns `id: string`, but `MailCategorySchema` validates `mailTypeId` as `z.number().int().positive()`. The `useMailTypeOptions` hook maps lookup data as `{value: mt.id, label: mt.name}` where `mt.id` is string. This causes a type mismatch — the select sends a string value but Zod expects a number.

The fix: align `mailTypeId` in the Zod schema and related code to use **string** (matching the API's `MailTypeLookup.id` type).

## Changes

### 1. `src/types/mail-category.ts`
- Change `mailTypeId` in `MailCategorySchema` from `z.number().int().positive()` to `z.string().min(1, "Tipe surat wajib dipilih")`

### 2. `src/hooks/mail-category-hooks.tsx`
- `useCreateMailCategory`: change `defaultValues.mailTypeId` from `1` to `""`
- `useUpdateMailCategory`: change `defaultValues.mailTypeId` from `undefined` to `""`
- `populate`: change `mailTypeId: Number(mc.mailType.id)` to `mailTypeId: mc.mailType.id`

### 3. `src/lib/mail-category-api.ts`
- Change `mailTypeId` param type from `number` to `string`

### 4. `src/hooks/mail-category-hooks.tsx` (useMailCategoryContent)
- Change `mailTypeId` state type from `number | undefined` to `string | undefined`

## Verification
- `bun run build` — no type errors
- Test create/edit mail category dialogs — select should correctly show and submit mailTypeId as string
