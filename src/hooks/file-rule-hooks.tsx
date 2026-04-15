import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/ui/tooltip-button";
import {
	createFileRule,
	deleteFileRule,
	fetchFileRules,
	updateFileRule,
} from "@/lib/file-rule-api";
import {
	type FileRuleDto,
	type FileRulePayload,
	FileRuleSchema,
} from "@/types/file-rule";
import { usePagination } from "./use-pagination";

const QUERY_KEY = "file-rules";

export function useFileRules(
	page = 0,
	size = 20,
	search?: string,
	context?: string,
	sortBy?: string,
	sortDir?: string,
) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size, search, context, sortBy, sortDir],
		queryFn: () => fetchFileRules(page, size, search, context, sortBy, sortDir),
	});
}

export function useCreateFileRule(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<FileRulePayload>({
		resolver: zodResolver(FileRuleSchema),
		defaultValues: {
			context: "",
			extension: "",
			maxSizeMb: 1,
			isActive: true,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: FileRulePayload) => createFileRule(data),
		onSuccess: () => {
			toast.success("Aturan file berhasil dibuat");
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

export function useUpdateFileRule(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<FileRulePayload>({
		resolver: zodResolver(FileRuleSchema),
		defaultValues: {
			context: "",
			extension: "",
			maxSizeMb: 1,
			isActive: true,
		},
	});

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: FileRulePayload }) =>
			updateFileRule(id, data),
		onSuccess: () => {
			toast.success("Aturan file berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = useCallback(
		(fr: FileRuleDto) => {
			form.reset({
				context: fr.context,
				extension: fr.extension,
				maxSizeMb: fr.maxSizeMb,
				isActive: fr.isActive,
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

export function useDeleteFileRule(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteFileRule(id),
		onSuccess: () => {
			toast.success("Aturan file berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}

export function useFileRuleContent() {
	const {
		page,
		setPage,
		pageSize,
		setPageSize,
		searchValue,
		setSearchValue,
		sorting,
		setSorting,
		sortBy,
		sortDir,
		searchParams,
		setStates,
	} = usePagination();

	const contextFilter = useMemo(
		() => searchParams.get("context") ?? undefined,
		[searchParams],
	);

	const setContextFilter = useCallback(
		(context?: string) => {
			setStates({ context, page: 0 });
		},
		[setStates],
	);

	const { data, isLoading } = useFileRules(
		page,
		pageSize,
		searchValue,
		contextFilter,
		sortBy,
		sortDir,
	);

	const [createOpen, setCreateOpen] = useState(false);
	const [editFr, setEditFr] = useState<FileRuleDto | null>(null);
	const [deleteFr, setDeleteFr] = useState<FileRuleDto | null>(null);

	const columns = useMemo<ColumnDef<FileRuleDto, unknown>[]>(
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
				accessorKey: "context",
				header: "Context",
				cell: ({ row }) => (
					<p className="text-sm font-medium">{row.original.context}</p>
				),
			},
			{
				accessorKey: "extension",
				header: "Ekstensi",
				cell: ({ row }) => (
					<p className="text-sm text-muted-foreground">
						{row.original.extension}
					</p>
				),
			},
			{
				accessorKey: "maxSizeMb",
				header: "Max Size (MB)",
				cell: ({ row }) => (
					<span className="text-sm">{row.original.maxSizeMb} MB</span>
				),
			},
			{
				accessorKey: "isActive",
				header: "Status",
				cell: ({ row }) => {
					const isActive = row.original.isActive;
					return (
						<Badge
							variant="outline"
							className={isActive ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}
						>
							{isActive ? "Aktif" : "Nonaktif"}
						</Badge>
					);
				},
				size: 100,
			},
			{
				id: "actions",
				header: () => <span className="sr-only">Aksi</span>,
				cell: ({ row }) => {
					const fr = row.original;
					return (
						<TooltipProvider delay={0}>
							<div className="flex justify-end gap-1">
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setEditFr(fr)}
									tooltip="Edit aturan file"
									className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
								>
									<IconPencil className="size-4" aria-hidden="true" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setDeleteFr(fr)}
									tooltip="Hapus aturan file"
									className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
								>
									<IconTrash className="size-4" aria-hidden="true" />
								</TooltipButton>
							</div>
						</TooltipProvider>
					);
				},
				size: 100,
				enableHiding: false,
			},
		],
		[page, pageSize],
	);

	const fileRules = useMemo(() => data?.content ?? [], [data?.content]);

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
		sorting,
		setSorting,
		searchValue,
		setSearchValue,
		contextFilter,
		setContextFilter,
		data,
		isLoading,
		columns,
		fileRules,
		createOpen,
		setCreateOpen,
		editFr,
		setEditFr,
		deleteFr,
		setDeleteFr,
	};
}
