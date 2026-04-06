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
	createMailType,
	deleteMailType,
	fetchMailTypes,
	toggleMailTypeStatus,
	updateMailType,
} from "@/lib/mail-type-api";
import {
	type MailTypeDto,
	type MailTypePayload,
	MailTypeSchema,
} from "@/types/mail-type";
import { queryParsers, useQueryStates } from "./use-query-state";

const QUERY_KEY = "mail-types";

export function useMailTypes(
	page = 0,
	size = 20,
	search?: string,
	sortBy?: string,
	sortDir?: string,
) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size, search, sortBy, sortDir],
		queryFn: () => fetchMailTypes(page, size, search, sortBy, sortDir),
	});
}

export function useCreateMailType(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<MailTypePayload>({
		resolver: zodResolver(MailTypeSchema),
		defaultValues: { name: "" },
	});

	const mutation = useMutation({
		mutationFn: (data: MailTypePayload) => createMailType(data),
		onSuccess: () => {
			toast.success("Tipe surat berhasil dibuat");
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

export function useUpdateMailType(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<MailTypePayload>({
		resolver: zodResolver(MailTypeSchema),
		defaultValues: { name: "" },
	});

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: MailTypePayload }) =>
			updateMailType(id, data),
		onSuccess: () => {
			toast.success("Tipe surat berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = useCallback(
		(mt: MailTypeDto) => {
			form.reset({ name: mt.name });
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

export function useMailTypeContent() {
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

	const { data, isLoading } = useMailTypes(
		page,
		pageSize,
		searchValue,
		sortBy,
		sortDir,
	);

	const [createOpen, setCreateOpen] = useState(false);
	const [editMt, setEditMt] = useState<MailTypeDto | null>(null);
	const [deleteMt, setDeleteMt] = useState<MailTypeDto | null>(null);
	const [duplicateMt, setDuplicateMt] = useState<MailTypeDto | null>(null);

	const toggleStatus = useToggleMailTypeStatus();

	const columns = useMemo<ColumnDef<MailTypeDto, unknown>[]>(
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
				accessorKey: "categoryCount",
				header: "Jumlah Kategori",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{row.original.categoryCount}
					</span>
				),
				size: 140,
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					const mt = row.original;
					return (
						<div className="flex items-center gap-2">
							<Switch
								checked={mt.status === "ACTIVE"}
								onCheckedChange={() => toggleStatus.mutate(mt.id)}
								disabled={toggleStatus.isPending}
								aria-label="Toggle status"
							/>
							<span
								className={`text-xs font-medium ${mt.status === "ACTIVE" ? "text-success" : "text-muted-foreground"}`}
							>
								{mt.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
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
					const mt = row.original;
					return (
						<TooltipProvider delay={0}>
							<div className="flex justify-end gap-1">
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => {
										setDuplicateMt(mt);
										setCreateOpen(true);
									}}
									tooltip="Duplikat tipe surat"
									className="h-8 w-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								>
									<IconCopy className="size-4" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setEditMt(mt)}
									tooltip="Edit tipe surat"
									className="h-8 w-8 text-info hover:bg-primary/10 hover:text-primary"
								>
									<IconPencil className="size-4" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setDeleteMt(mt)}
									tooltip="Hapus tipe surat"
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

	const mailTypes = useMemo(() => data?.content ?? [], [data?.content]);

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
		mailTypes,
		createOpen,
		setCreateOpen,
		editMt,
		setEditMt,
		deleteMt,
		setDeleteMt,
		duplicateMt,
		setDuplicateMt,
		toggleStatus,
	};
}

export function useDeleteMailType(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteMailType(id),
		onSuccess: () => {
			toast.success("Tipe surat berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}

export function useToggleMailTypeStatus(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => toggleMailTypeStatus(id),
		onSuccess: () => {
			toast.success("Status tipe surat berhasil diubah");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
