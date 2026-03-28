# Code Patterns Reference

## Type Definition Pattern (`src/types/<feature>.ts`)

```ts
import { z } from "zod/v4";

// Use z.number() NOT z.coerce.number() — coerce causes resolver type mismatch
export const CreateFeatureSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string(),
  typeId: z.number().min(1, "Tipe wajib dipilih"),
  active: z.boolean(),
});

export type CreateFeaturePayload = z.infer<typeof CreateFeatureSchema>;

export interface FeatureDto {
  id: number;
  name: string;
  // ... all fields from API response
  totalCount: number; // if paginated
}

export interface FeatureFilter {
  keyword?: string;
  status?: string;
}
```

## API Client Pattern (`src/lib/<feature>-api.ts`)

```ts
const BASE = "/api/proxy/<endpoint>";

export async function fetchFeatures(filter, offset, limit): Promise<FeatureDto[]> {
  const params = new URLSearchParams();
  // build params from filter
  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json();
}

// Multipart upload (for Spring @RequestPart endpoints)
export async function createFeature(data, file?: File): Promise<FeatureDto> {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
  if (file) formData.append("file", file);

  const res = await fetch(BASE, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Gagal membuat data");
  }
  return res.json();
}
```

## Hook Pattern (`src/hooks/<feature>-hooks.tsx`)

```ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const QUERY_KEY = "features";

export function useFeatures(filter, offset, limit) {
  return useQuery({
    queryKey: [QUERY_KEY, filter, offset, limit],
    queryFn: () => fetchFeatures(filter, offset, limit),
  });
}

export function useCreateFeature(onSuccess?: () => void) {
  const qc = useQueryClient();
  const form = useForm<CreateFeaturePayload>({
    resolver: zodResolver(CreateFeatureSchema),
    defaultValues: { name: "", description: "", typeId: 0, active: false },
  });

  const mutation = useMutation({
    mutationFn: ({ data, file }) => createFeature(data, file),
    onSuccess: () => {
      toast.success("Berhasil dibuat");
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => toast.error(err.message),
  });

  return { form, mutation };
}
```

## Form Submission Pattern (avoid handleSubmit generic erasure)

```tsx
// DO THIS — works with React Compiler
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const valid = await form.trigger();
  if (!valid) return;
  const data = form.getValues() as CreateFeaturePayload;
  mutation.mutate({ data });
};

// DON'T DO THIS — React Compiler erases TFieldValues generic
const onSubmit = form.handleSubmit((data) => {
  mutation.mutate({ data }); // TS error: TFieldValues not assignable
});
```

## Page Pattern (`src/app/(main)/<route>/page.tsx`)

```tsx
// Server component — thin wrapper
import { FeatureContent } from "@/components/<feature>/<feature>-content";

export const dynamic = "force-dynamic";

export default function FeaturePage() {
  return <FeatureContent />;
}
```

## Component Split Pattern

```
<feature>-content.tsx    — "use client", state management, orchestrates sub-components
<feature>-table.tsx      — Pure display, receives data + callbacks via props
<feature>-form-dialog.tsx — Create/Edit dialogs, each uses its own hook
<feature>-delete-dialog.tsx — Delete confirmation, uses useDeleteFeature hook
```

## FormFields Typing Pattern (shared between create/edit)

```tsx
function FormFields({
  register,
  errors,
  fileRef,
}: {
  register: ReturnType<typeof useCreateFeature>["form"]["register"];
  errors: ReturnType<typeof useCreateFeature>["form"]["formState"]["errors"];
  fileRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <FieldGroup className="px-4 py-4">
      <Field>
        <FieldLabel htmlFor="f-name">Nama *</FieldLabel>
        <Input id="f-name" {...register("name")} />
        <FieldError errors={[errors.name]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="f-typeId">Tipe *</FieldLabel>
        <Input id="f-typeId" type="number" {...register("typeId", { valueAsNumber: true })} />
        <FieldError errors={[errors.typeId]} />
      </Field>
    </FieldGroup>
  );
}
```
