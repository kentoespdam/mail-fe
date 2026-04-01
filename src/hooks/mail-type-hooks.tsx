import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	createMailType,
	deleteMailType,
	fetchMailTypes,
	updateMailType,
} from "@/lib/mail-type-api";
import {
	type MailTypeDto,
	type MailTypePayload,
	MailTypeSchema,
} from "@/types/mail-type";

const QUERY_KEY = "mail-types";

export function useMailTypes(page = 0, size = 20) {
	return useQuery({
		queryKey: [QUERY_KEY, page, size],
		queryFn: () => fetchMailTypes(page, size),
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
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(DEFAULT_SIZE);
	const { data, isLoading } = useMailTypes(page, pageSize);

	const [createOpen, setCreateOpen] = useState(false);
	const [editMt, setEditMt] = useState<MailTypeDto | null>(null);
	const [deleteMt, setDeleteMt] = useState<MailTypeDto | null>(null);

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
				id: "actions",
				header: () => <span className="sr-only">Aksi</span>,
				cell: ({ row }) => {
					const mt = row.original;
					return (
						<div className="flex justify-end gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setEditMt(mt)}
								title="Edit tipe surat"
								className="h-8 w-8 text-info hover:bg-primary/10 hover:text-primary"
							>
								<IconPencil className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setDeleteMt(mt)}
								title="Hapus tipe surat"
								className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
							>
								<IconTrash className="size-4" />
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

	const mailTypes = useMemo(() => data?.content ?? [], [data?.content]);

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
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
