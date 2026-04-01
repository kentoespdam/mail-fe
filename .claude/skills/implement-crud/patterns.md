# CRUD Feature Pattern (Compact)

**Ref:** `pesan-singkat` | **Route:** `/master/{route}` | **API:** `/api/proxy/{endpoint}`

## 📂 File Structure
- `src/types/{f}.ts` : Zod Schema + DTO + Page Interface
- `src/lib/{f}-api.ts` : Fetch wrappers (Next.js Proxy)
- `src/hooks/{f}-hooks.tsx` : TanStack Query + RHF Logic + Content Orchestrator
- `src/components/{f}/` : UI (Content, Form Dialogs, Delete Dialog)
- `src/app/(main)/master/{r}/page.tsx` : Page wrapper (`force-dynamic`)

---

## 🛠 1. Types & API (`types/` & `lib/`)

```tsx
// types/{feature}.ts
export const {F}Schema = z.object({ field: z.string().min(1, "Wajib diisi") });
export type {F}Payload = z.infer<typeof {F}Schema>;
export interface {F}Dto { id: number; field: string; }
export interface Page{F} { content: {F}Dto[]; totalPages: number; totalElements: number; /* ...standard Spring Page */ }

// lib/{feature}-api.ts
const BASE = "/api/proxy/{endpoint}";
export const fetch{F}s = (p=0, s=20) => fetch(`${BASE}?page=${p}&size=${s}`).then(res => res.json());
export const create{F} = (data: {F}Payload) => fetch(BASE, { method: "POST", body: JSON.stringify(data) });
// ...update (PUT), delete (DELETE) follow same pattern with error handling on !res.ok
```

---

## 🪝 2. Hooks (`hooks/{feature}-hooks.tsx`)

Gabungkan logika state management dan TanStack Query.

```tsx
const QK = "{feature-plural}";

export const use{F}s = (p, s) => useQuery({ queryKey: [QK, p, s], queryFn: () => fetch{F}s(p, s) });

export function use{F}Mutations(onSuccess) {
  const qc = useQueryClient();
  const invalidate = () => { qc.invalidateQueries({ queryKey: [QK] }); onSuccess?.(); };

  const create = useMutation({ mutationFn: create{F}, onSuccess: () => { toast.success("Berhasil dibuat"); invalidate(); } });
  const update = useMutation({ mutationFn: ({id, data}) => update{F}(id, data), onSuccess: () => { toast.success("Berhasil diperbarui"); invalidate(); } });
  const remove = useMutation({ mutationFn: delete{F}, onSuccess: () => { toast.success("Berhasil dihapus"); invalidate(); } });

  return { create, update, remove };
}

export function use{F}Content() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const { data, isLoading } = use{F}s(page, size);
  const [modals, setModals] = useState({ create: false, edit: null, del: null });

  const columns = useMemo(() => [
    { id: "index", header: "#", cell: ({ row }) => page * size + row.index + 1 },
    // ...data columns
    { id: "actions", cell: ({ row }) => (
      <div className="flex gap-1">
        <Button onClick={() => setModals(m => ({...m, edit: row.original}))}><IconPencil/></Button>
        <Button onClick={() => setModals(m => ({...m, del: row.original}))}><IconTrash/></Button>
      </div>
    )}
  ], [page, size]);

  return { ...modals, setModals, data, isLoading, columns, page, setPage, size, setSize };
}
```

---

## 🖥 3. Components (UI)

### Form Dialog (`{feature}-form-dialog.tsx`)
Gunakan satu hook per form untuk merampingkan dialog.

```tsx
export function Create{F}Dialog({ open, onOpenChange }) {
  const { create } = use{F}Mutations(() => onOpenChange(false));
  const form = useForm({ resolver: zodResolver({F}Schema) });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={form.handleSubmit(create.mutate)}>
        <FieldGroup><InputTextControll form={form} id="field" label="Field" /></FieldGroup>
        <DialogFooter>
          <Button type="submit" disabled={create.isPending}>Simpan</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
// EditDialog: Sama, gunakan useEffect(() => { if(item) form.reset(item) }, [item])
```

### Content (`{feature}-content.tsx`)
```tsx
export const {F}Content = memo(() => {
  const s = use{F}Content();
  return (
    <>
      <Card>
        <CardHeader>
           <CardTitle>{Title}</CardTitle>
           <Button onClick={() => s.setModals(m => ({...m, create: true}))}>Tambah</Button>
        </CardHeader>
        <DataTable columns={s.columns} data={s.data?.content ?? []} isLoading={s.isLoading} />
        <DataTablePagination page={s.page} pageCount={s.data?.totalPages} onPageChange={s.setPage} />
      </Card>
      
      <Create{F}Dialog open={s.create} onOpenChange={(v) => s.setModals(m => ({...m, create: v}))} />
      <Edit{F}Dialog item={s.edit} onClose={() => s.setModals(m => ({...m, edit: null}))} />
      <Delete{F}Dialog item={s.del} onClose={() => s.setModals(m => ({...m, del: null}))} />
    </>
  );
});
```

---

## ✅ Quick Convention Checklist
1.  **Lingo:** UI & Toast wajib **Bahasa Indonesia**.
2.  **State:** Gunakan `pending` state pada tombol (e.g., `Menyimpan...`).
3.  **Ref:** Selalu gunakan `memo()` dan `displayName` untuk komponen UI.
4.  **Zod:** Import via `zod/v4`.
5.  **Query:** Invalidation selalu menggunakan `prefix match` (`[QK]`).
6.  **Proxy:** Endpoint selalu diawali `/api/proxy/`.