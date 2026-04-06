import { zodResolver } from "@hookform/resolvers/zod";
import { IconCopy, IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/ui/tooltip-button";
import {
	createQuickMessage,
	deleteQuickMessage,
	fetchQuickMessages,
	updateQuickMessage,
} from "@/lib/quick-message-api";
import {
	type QuickMessageDto,
	type QuickMessagePayload,
	QuickMessageSchema,
} from "@/types/quick-message";
import { queryParsers, useQueryStates } from "./use-query-state";

const QUERY_KEY = "quick-messages";

export function useQuickMessages(
	page = 0,
	size = 20,
	search?: string,
	sortBy?: string,
	sortDir?: string,
) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size, search, sortBy, sortDir],
		queryFn: () => fetchQuickMessages(page, size, search, sortBy, sortDir),
	});
}

export function useCreateQuickMessage(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<QuickMessagePayload>({
		resolver: zodResolver(QuickMessageSchema),
		defaultValues: { message: "" },
	});

	const mutation = useMutation({
		mutationFn: (data: QuickMessagePayload) => createQuickMessage(data),
		onSuccess: () => {
			toast.success("Pesan singkat berhasil dibuat");
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

export function useUpdateQuickMessage(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<QuickMessagePayload>({
		resolver: zodResolver(QuickMessageSchema),
		defaultValues: { message: "" },
	});

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: QuickMessagePayload }) =>
			updateQuickMessage(id, data),
		onSuccess: () => {
			toast.success("Pesan singkat berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = useCallback(
		(qm: QuickMessageDto) => {
			form.reset({ message: qm.message });
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

export function useQuickMessageContent() {
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

	const { data, isLoading } = useQuickMessages(
		page,
		pageSize,
		searchValue,
		sortBy,
		sortDir,
	);

	const [createOpen, setCreateOpen] = useState(false);
	const [editQm, setEditQm] = useState<QuickMessageDto | null>(null);
	const [deleteQm, setDeleteQm] = useState<QuickMessageDto | null>(null);
	const [duplicateQm, setDuplicateQm] = useState<QuickMessageDto | null>(null);

	const columns = useMemo<ColumnDef<QuickMessageDto, unknown>[]>(
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
				accessorKey: "message",
				header: "Pesan",
				cell: ({ row }) => {
					const message = row.original.message;
					const preview =
						message.length > 60 ? `${message.slice(0, 60)}…` : message;

					return (
						<p className="line-clamp-2 text-sm text-foreground">{preview}</p>
					);
				},
				minSize: 300,
			},
			{
				id: "actions",
				header: () => <span className="sr-only">Aksi</span>,
				cell: ({ row }) => {
					const qm = row.original;
					return (
						<TooltipProvider delay={0}>
							<div className="flex justify-end gap-1">
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => {
										setDuplicateQm(qm);
										setCreateOpen(true);
									}}
									tooltip="Duplikat pesan"
									className="h-8 w-8 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								>
									<IconCopy className="size-4" aria-hidden="true" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setEditQm(qm)}
									tooltip="Edit pesan"
									className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
								>
									<IconPencil className="size-4" aria-hidden="true" />
								</TooltipButton>
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setDeleteQm(qm)}
									tooltip="Hapus pesan"
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
		[page, pageSize],
	);

	const messages = useMemo(() => data?.content ?? [], [data?.content]);

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
		messages,
		createOpen,
		setCreateOpen,
		editQm,
		setEditQm,
		deleteQm,
		setDeleteQm,
		duplicateQm,
		setDuplicateQm,
	};
}

export function useDeleteQuickMessage(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteQuickMessage(id),
		onSuccess: () => {
			toast.success("Pesan singkat berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
