import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

const QUERY_KEY = "quick-messages";

export function useQuickMessages(page = 0, size = 20) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size],
		queryFn: () => fetchQuickMessages(page, size),
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

	const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

	return { form, mutation, onSubmit };
}

export function useUpdateQuickMessage(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<QuickMessagePayload>({
		resolver: zodResolver(QuickMessageSchema),
		defaultValues: { message: "" },
	});

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: QuickMessagePayload }) =>
			updateQuickMessage(id, data),
		onSuccess: () => {
			toast.success("Pesan singkat berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = (qm: QuickMessageDto) => {
		form.reset({ message: qm.message });
	};

	const onSubmit = (id: number) =>
		form.handleSubmit((data) => mutation.mutate({ id, data }))();

	return { form, mutation, populate, onSubmit };
}

const DEFAULT_SIZE = 20;

export function useQuickMessageContent() {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(DEFAULT_SIZE);
	const { data, isLoading } = useQuickMessages(page, pageSize);

	const [createOpen, setCreateOpen] = useState(false);
	const [editQm, setEditQm] = useState<QuickMessageDto | null>(null);
	const [deleteQm, setDeleteQm] = useState<QuickMessageDto | null>(null);

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
						<p className="line-clamp-2 text-sm font-medium text-foreground">
							{preview}
						</p>
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
						<div className="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setEditQm(qm)}
								title="Edit pesan"
								className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
							>
								<IconPencil className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setDeleteQm(qm)}
								title="Hapus pesan"
								className="h-8 w-8 bg-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
							>
								<IconTrash className="h-4 w-4" />
							</Button>
						</div>
					);
				},
				size: 100,
				enableHiding: false,
			},
		],
		[page, pageSize],
	);

	const messages = data?.content ?? [];

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
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
	};
}

export function useDeleteQuickMessage(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteQuickMessage(id),
		onSuccess: () => {
			toast.success("Pesan singkat berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
