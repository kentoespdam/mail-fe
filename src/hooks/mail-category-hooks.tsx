import { zodResolver } from "@hookform/resolvers/zod";
import { IconCopy, IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/ui/tooltip-button";
import {
	createMailCategory,
	deleteMailCategory,
	fetchMailCategories,
	fetchMailCategory,
	toggleMailCategoryStatus,
	updateMailCategory,
} from "@/lib/mail-category-api";
import { fetchMailTypesLookup } from "@/lib/mail-type-api";
import {
	type MailCategoryDto,
	type MailCategoryPayload,
	MailCategorySchema,
	type MailTypeMini,
} from "@/types/mail-category";
import { queryParsers, useQueryStates } from "./use-query-state";

const QUERY_KEY = "mail-categories";

export function useMailCategory(id: string | null) {
	return useQuery({
		queryKey: ["mail-category", id],
		queryFn: () => fetchMailCategory(id as string),
		enabled: !!id,
	});
}

export function useMailCategories(
	page = 0,
	size = 20,
	search?: string,
	mailTypeId?: string,
	sortBy?: string,
	sortDir?: string,
) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size, search, mailTypeId, sortBy, sortDir],
		queryFn: () =>
			fetchMailCategories(page, size, search, mailTypeId, sortBy, sortDir),
	});
}

export function useMailTypeOptions() {
	return useQuery({
		queryKey: ["mail-types-lookup"],
		queryFn: () => fetchMailTypesLookup(),
		select: (data) =>
			data.map((mt: MailTypeMini) => ({
				value: String(mt.id),
				label: mt.name,
			})),
	});
}

export function useCreateMailCategory(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<MailCategoryPayload>({
		resolver: zodResolver(MailCategorySchema),
		defaultValues: {
			mailTypeId: "",
			code: "",
			name: "",
			sort: 0,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: MailCategoryPayload) => createMailCategory(data),
		onSuccess: () => {
			toast.success("Kategori surat berhasil dibuat");
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

export function useUpdateMailCategory(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<MailCategoryPayload>({
		resolver: zodResolver(MailCategorySchema),
		defaultValues: {
			mailTypeId: "",
			code: "",
			name: "",
			sort: undefined,
		},
	});

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: MailCategoryPayload }) =>
			updateMailCategory(id, data),
		onSuccess: () => {
			toast.success("Kategori surat berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = useCallback(
		(mc: MailCategoryDto) => {
			form.reset({
				mailTypeId: String(mc.mailType?.id ?? ""),
				code: mc.code,
				name: mc.name,
				sort: mc.sort,
			});
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

export function useDeleteMailCategory(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteMailCategory(id),
		onSuccess: () => {
			toast.success("Kategori surat berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}

const DEFAULT_SIZE = 20;

export function useMailCategoryContent() {
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
	const mailTypeId = useMemo(
		() => queryParsers.optionalString(searchParams.get("mailTypeId")),
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
	const setMailTypeId = useCallback(
		(id: string | null | undefined) => {
			const value = id === "all" || id === null ? undefined : id;
			setStates({ mailTypeId: value, page: 0 });
		},
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

	const { data, isLoading } = useMailCategories(
		page,
		pageSize,
		searchValue,
		mailTypeId,
		sortBy,
		sortDir,
	);

	const { data: mailTypeOptions = [], isLoading: isLoadingMailTypes } =
		useMailTypeOptions();

	const [createOpen, setCreateOpen] = useState(false);
	const [editMc, setEditMc] = useState<string | null>(null);
	const [deleteMc, setDeleteMc] = useState<MailCategoryDto | null>(null);
	const [duplicateMc, setDuplicateMc] = useState<MailCategoryDto | null>(null);

	const toggleStatus = useToggleMailCategoryStatus();

	const columns = useMemo<ColumnDef<MailCategoryDto, unknown>[]>(
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
				accessorKey: "code",
				header: "Kode",
				cell: ({ row }) => (
					<span className="text-sm font-mono text-foreground">
						{row.original.code}
					</span>
				),
				size: 120,
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
				accessorKey: "mailType.name",
				header: "Tipe Surat",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{row.original.mailType?.name ?? "-"}
					</span>
				),
				size: 160,
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					const mc = row.original;
					return (
						<div className="flex items-center gap-2">
							<Switch
								checked={mc.status === "ACTIVE"}
								onCheckedChange={() => toggleStatus.mutate(mc.id)}
								disabled={toggleStatus.isPending}
								aria-label="Toggle status"
							/>
							<span
								className={`text-xs font-medium ${mc.status === "ACTIVE" ? "text-success" : "text-muted-foreground"}`}
							>
								{mc.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
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
					const mc = row.original;
					return (
						<TooltipProvider delay={0}>
							<div className="flex justify-end gap-1">
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => {
										setDuplicateMc(mc);
										setCreateOpen(true);
									}}
									tooltip="Duplikat kategori surat"
									className="h-8 w-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								>
									<IconCopy className="size-4" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setEditMc(mc.id)}
									tooltip="Edit kategori surat"
									className="h-8 w-8 text-info hover:bg-primary/10 hover:text-primary"
								>
									<IconPencil className="size-4" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setDeleteMc(mc)}
									tooltip="Hapus kategori surat"
									className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
								>
									<IconTrash className="size-4" />
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

	const mailCategories = useMemo(() => data?.content ?? [], [data?.content]);

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
		sorting,
		setSorting,
		searchValue,
		setSearchValue,
		mailTypeId,
		setMailTypeId,
		mailTypeOptions,
		data,
		isLoading: isLoading || isLoadingMailTypes,
		columns,
		mailCategories,
		createOpen,
		setCreateOpen,
		editMc,
		setEditMc,
		deleteMc,
		setDeleteMc,
		duplicateMc,
		setDuplicateMc,
		toggleStatus,
	};
}

export function useToggleMailCategoryStatus(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => toggleMailCategoryStatus(id),
		onSuccess: () => {
			toast.success("Status kategori surat berhasil diubah");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
