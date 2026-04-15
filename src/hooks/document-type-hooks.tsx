import { zodResolver } from "@hookform/resolvers/zod";
import { IconCopy, IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/ui/tooltip-button";
import {
	createDocumentType,
	deleteDocumentType,
	fetchDocumentTypes,
	toggleDocumentTypeStatus,
	updateDocumentType,
} from "@/lib/document-type-api";
import {
	type DocumentTypeDto,
	type DocumentTypePayload,
	DocumentTypeSchema,
} from "@/types/document-type";
import { queryParsers, useQueryStates } from "./use-query-state";

const QUERY_KEY = "document-types";

export function useDocumentTypes(
	page = 0,
	size = 20,
	search?: string,
	sortBy?: string,
	sortDir?: string,
) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size, search, sortBy, sortDir],
		queryFn: () => fetchDocumentTypes(page, size, search, sortBy, sortDir),
	});
}

export function useCreateDocumentType(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<DocumentTypePayload>({
		resolver: zodResolver(DocumentTypeSchema),
		defaultValues: { name: "" },
	});

	const mutation = useMutation({
		mutationFn: (data: DocumentTypePayload) => createDocumentType(data),
		onSuccess: () => {
			toast.success("Jenis dokumen berhasil dibuat");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			form.reset();
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const onSubmit = useCallback(
		() => form.handleSubmit((data) => mutation.mutate(data))(),
		[form, mutation],
	);

	return { form, mutation, onSubmit };
}

export function useUpdateDocumentType(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<DocumentTypePayload>({
		resolver: zodResolver(DocumentTypeSchema),
		defaultValues: { name: "" },
	});

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: DocumentTypePayload }) =>
			updateDocumentType(id, data),
		onSuccess: () => {
			toast.success("Jenis dokumen berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = useCallback(
		(dt: DocumentTypeDto) => {
			form.reset({ name: dt.name });
		},
		[form],
	);

	const onSubmit = useCallback(
		(id: string) =>
			form.handleSubmit((data) => mutation.mutate({ id, data }))(),
		[form, mutation],
	);

	return { form, mutation, populate, onSubmit };
}

const DEFAULT_SIZE = 20;

export function useDocumentTypeContent() {
	const { searchParams, setStates } = useQueryStates();

	const page = useMemo(
		() => queryParsers.number(searchParams.get("page")),
		[searchParams],
	);
	const pageSize = useMemo(
		() => queryParsers.number(searchParams.get("size")) || DEFAULT_SIZE,
		[searchParams],
	);
	const searchValue = useMemo(
		() => queryParsers.string(searchParams.get("search")),
		[searchParams],
	);
	const sortBy = useMemo(
		() => queryParsers.string(searchParams.get("sortBy")),
		[searchParams],
	);
	const sortDir = useMemo(
		() => queryParsers.string(searchParams.get("sortDir")) || "asc",
		[searchParams],
	);

	const sorting = useMemo<SortingState>(
		() => (sortBy ? [{ id: sortBy, desc: sortDir === "desc" }] : []),
		[sortBy, sortDir],
	);

	const setPage = useCallback(
		(p: number) => setStates({ page: p }),
		[setStates],
	);
	const setPageSize = useCallback(
		(s: number) => setStates({ size: s, page: 0 }),
		[setStates],
	);
	const setSearchValue = useCallback(
		(s: string) => setStates({ search: s, page: 0 }),
		[setStates],
	);
	const setSorting = useCallback(
		(updater: SortingState | ((prev: SortingState) => SortingState)) => {
			const next = typeof updater === "function" ? updater(sorting) : updater;
			const item = next[0];
			setStates({
				sortBy: item?.id,
				sortDir: item ? (item.desc ? "desc" : "asc") : undefined,
				page: 0,
			});
		},
		[setStates, sorting],
	);

	const { data, isLoading } = useDocumentTypes(
		page,
		pageSize,
		searchValue,
		sortBy,
		sortDir,
	);

	const [createOpen, setCreateOpen] = useState(false);
	const [editDt, setEditDt] = useState<DocumentTypeDto | null>(null);
	const [deleteDt, setDeleteDt] = useState<DocumentTypeDto | null>(null);
	const [duplicateDt, setDuplicateDt] = useState<DocumentTypeDto | null>(null);

	const toggleStatus = useToggleDocumentTypeStatus();

	const columns = useMemo<ColumnDef<DocumentTypeDto, unknown>[]>(
		() => [
			{
				id: "index",
				header: "#",
				cell: ({ row }) => (
					<span className="font-medium text-muted-foreground">
						{page * pageSize + row.index + 1}
					</span>
				),
				size: 60,
				enableHiding: false,
			},
			{
				accessorKey: "name",
				header: "Nama",
				cell: ({ row }) => (
					<p className="text-sm text-foreground">{row.original.name}</p>
				),
				minSize: 200,
			},
			{
				accessorKey: "publicationCount",
				header: "Jumlah Publikasi",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{row.original.publicationCount}
					</span>
				),
				size: 140,
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					const dt = row.original;
					return (
						<div className="flex items-center gap-2">
							<Switch
								checked={dt.status === "ACTIVE"}
								onCheckedChange={() => toggleStatus.mutate(dt.id)}
								disabled={toggleStatus.isPending}
								aria-label="Toggle status"
							/>
							<span
								className={`text-xs font-medium ${dt.status === "ACTIVE" ? "text-success" : "text-muted-foreground"}`}
							>
								{dt.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
							</span>
						</div>
					);
				},
				size: 120,
			},
			{
				id: "actions",
				header: () => <span className="sr-only">Aksi</span>,
				cell: ({ row }) => {
					const dt = row.original;
					return (
						<TooltipProvider delay={0}>
							<div className="flex justify-end gap-1">
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => {
										setDuplicateDt(dt);
										setCreateOpen(true);
									}}
									tooltip="Duplikat jenis dokumen"
									className="h-8 w-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								>
									<IconCopy className="size-4" aria-hidden="true" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setEditDt(dt)}
									tooltip="Edit jenis dokumen"
									className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
								>
									<IconPencil className="size-4" aria-hidden="true" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setDeleteDt(dt)}
									tooltip="Hapus jenis dokumen"
									className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
								>
									<IconTrash className="size-4" aria-hidden="true" />
								</TooltipButton>
							</div>
						</TooltipProvider>
					);
				},
				size: 120,
				enableHiding: false,
			},
		],
		[page, pageSize, toggleStatus],
	);

	const documentTypes = useMemo(() => data?.content ?? [], [data?.content]);

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
		sorting,
		setSorting,
		searchValue,
		setSearchValue,
		data,
		isLoading,
		columns,
		documentTypes,
		createOpen,
		setCreateOpen,
		editDt,
		setEditDt,
		deleteDt,
		setDeleteDt,
		duplicateDt,
		setDuplicateDt,
		toggleStatus,
	};
}

export function useDeleteDocumentType(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteDocumentType(id),
		onSuccess: () => {
			toast.success("Jenis dokumen berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}

export function useToggleDocumentTypeStatus(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => toggleDocumentTypeStatus(id),
		onSuccess: () => {
			toast.success("Status jenis dokumen berhasil diubah");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
