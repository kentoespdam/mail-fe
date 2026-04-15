import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconCloudUpload,
	IconDownload,
	IconEye,
	IconFile,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/ui/tooltip-button";
import {
	createPublication,
	deletePublication,
	fetchDocumentTypesLookup,
	fetchPublication,
	fetchPublications,
	publishPublication,
	triggerDownload,
	updatePublication,
} from "@/lib/publication-api";
import { hasPermission } from "@/lib/rbac";
import type { PagedResponse } from "@/types/commons";
import {
	type CreatePublicationPayload,
	CreatePublicationSchema,
	type PublicationDto,
	type UpdatePublicationPayload,
} from "@/types/publication";
import { queryParsers, usePagination } from "./use-pagination";
import { useUser } from "./use-user";

const QUERY_KEY = "publications";

// ─── Single publication ──────────────────────────────────────────
export function usePublication(id: string | null) {
	return useQuery({
		queryKey: ["publication", id],
		queryFn: () => fetchPublication(id as string),
		enabled: !!id,
	});
}

// ─── List ────────────────────────────────────────────────────────
export function usePublications(
	page = 0,
	size = 20,
	search?: string,
	status?: string,
	sortBy?: string,
	sortDir?: string,
) {
	return useQuery<PagedResponse<PublicationDto>>({
		queryKey: [QUERY_KEY, page, size, search, status, sortBy, sortDir],
		queryFn: () =>
			fetchPublications(page, size, search, status, sortBy, sortDir),
	});
}

// ─── Document type options ───────────────────────────────────────
export function useDocumentTypeOptions() {
	return useQuery({
		queryKey: ["document-types-lookup"],
		queryFn: () => fetchDocumentTypesLookup(),
		select: (data) =>
			data.map((dt) => ({
				value: dt.id,
				label: dt.name,
			})),
	});
}

// ─── Helpers ─────────────────────────────────────────────────────
const statusBadge = (status: string) => {
	switch (status) {
		case "PUBLISHED":
			return <Badge variant="default">Terbit</Badge>;
		case "DRAFT":
			return <Badge variant="outline">Draf</Badge>;
		case "DELETED":
			return <Badge variant="destructive">Dihapus</Badge>;
		default:
			return <Badge variant="secondary">{status}</Badge>;
	}
};

export const formatDate = (iso: string | null) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

export const formatFileSize = (bytes: number | null) => {
	if (!bytes) return "—";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileType = (
	fileName: string | null,
): "pdf" | "image" | "other" => {
	if (!fileName) return "other";
	const ext = fileName.split(".").pop()?.toLowerCase();
	if (ext === "pdf") return "pdf";
	if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
		return "image";
	return "other";
};

// ─── Content hook ────────────────────────────────────────────────
export function usePublicationContent() {
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

	const status = useMemo(
		() => queryParsers.optionalString(searchParams.get("status")),
		[searchParams],
	);

	const setStatus = useCallback(
		(s: string | null | undefined) => {
			const value = s === "all" || s === null ? undefined : s;
			setStates({ status: value, page: 0 });
		},
		[setStates],
	);

	const { data, isLoading } = usePublications(
		page,
		pageSize,
		searchValue || undefined,
		status,
		sortBy,
		sortDir,
	);

	const [createOpen, setCreateOpen] = useState(false);
	const [editPubId, setEditPubId] = useState<string | null>(null);
	const [detailPub, setDetailPub] = useState<PublicationDto | null>(null);
	const [deletePub, setDeletePub] = useState<PublicationDto | null>(null);
	const [publishPub, setPublishPub] = useState<PublicationDto | null>(null);
	const [previewPub, setPreviewPub] = useState<PublicationDto | null>(null);
	const publishMutation = usePublishPublication();

	const { user } = useUser();
	const canWrite = useMemo(
		() => hasPermission(user?.roles || [], "publikasi:write"),
		[user?.roles],
	);

	const columns = useMemo<ColumnDef<PublicationDto, unknown>[]>(
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
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: "title",
				header: "Judul",
				cell: ({ row }) => (
					<span className="max-w-xs truncate font-medium text-foreground">
						{row.original.title}
					</span>
				),
				minSize: 200,
			},
			{
				accessorKey: "documentType.name",
				header: "Tipe Dokumen",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{row.original.documentType?.name ?? "—"}
					</span>
				),
				size: 160,
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => statusBadge(row.original.status),
				size: 100,
			},
			{
				id: "file",
				header: "File",
				cell: ({ row }) => {
					const pub = row.original;
					return pub.fileName ? (
						<span className="flex items-center gap-1 text-sm">
							<IconFile className="size-3.5" aria-hidden="true" />
							<span className="max-w-24 truncate">{pub.fileName}</span>
							<span className="text-muted-foreground">
								({formatFileSize(pub.fileSize)})
							</span>
						</span>
					) : (
						"—"
					);
				},
				enableSorting: false,
				size: 180,
			},
			{
				accessorKey: "createdAt",
				header: "Dibuat",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{formatDate(row.original.createdAt)}
					</span>
				),
				size: 120,
			},
			{
				id: "actions",
				header: () => <span className="sr-only">Aksi</span>,
				cell: ({ row }) => {
					const pub = row.original;
					return (
						<TooltipProvider delay={0}>
							<div className="flex justify-end gap-1">
								<TooltipButton
									variant="ghost"
									size="icon-sm"
									onClick={() => setDetailPub(pub)}
									tooltip="Lihat detail publikasi"
									className="h-8 w-8 text-info hover:bg-info/10 hover:text-info"
								>
									<IconEye className="size-4" aria-hidden="true" />
								</TooltipButton>
								{canWrite && (
									<>
										{pub.status === "DRAFT" && (
											<TooltipButton
												variant="ghost"
												size="icon-sm"
												onClick={() => setPublishPub(pub)}
												tooltip="Terbitkan publikasi"
												className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
											>
												<IconCloudUpload
													className="size-4"
													aria-hidden="true"
												/>
											</TooltipButton>
										)}
										<TooltipButton
											variant="ghost"
											size="icon-sm"
											onClick={() => setEditPubId(pub.id)}
											tooltip="Edit publikasi"
											className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
										>
											<IconPencil className="size-4" aria-hidden="true" />
										</TooltipButton>
										<TooltipButton
											variant="ghost"
											size="icon-sm"
											onClick={() => setDeletePub(pub)}
											tooltip="Hapus publikasi"
											className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
										>
											<IconTrash className="size-4" aria-hidden="true" />
										</TooltipButton>
									</>
								)}

								{pub.fileName && (
									<TooltipButton
										variant="ghost"
										size="icon-sm"
										onClick={() => {
											const type = getFileType(pub.fileName);
											if (type === "other") {
												triggerDownload(pub.id, pub.fileName as string);
											} else {
												setPreviewPub(pub);
											}
										}}
										tooltip={
											getFileType(pub.fileName) === "other"
												? "Download file"
												: "Preview file"
										}
										className="h-8 w-8 text-green-500 hover:bg-secondary/10 hover:text-secondary"
									>
										<IconDownload className="size-4" aria-hidden="true" />
									</TooltipButton>
								)}
							</div>
						</TooltipProvider>
					);
				},
				size: 180,
				enableSorting: false,
				enableHiding: false,
			},
		],
		[page, pageSize, canWrite],
	);

	const publications = useMemo(() => data?.content ?? [], [data?.content]);

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
		sorting,
		setSorting,
		searchValue,
		setSearchValue,
		status,
		setStatus,
		data,
		isLoading,
		columns,
		publications,
		createOpen,
		setCreateOpen,
		editPubId,
		setEditPubId,
		deletePub,
		setDeletePub,
		detailPub,
		setDetailPub,
		publishPub,
		setPublishPub,
		publishMutation,
		previewPub,
		setPreviewPub,
		canWrite,
	};
}

// ─── Create mutation ─────────────────────────────────────────────
export function useCreatePublication(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<CreatePublicationPayload>({
		resolver: zodResolver(CreatePublicationSchema),
		defaultValues: {
			title: "",
			description: "",
			documentTypeId: "",
			publish: false,
		},
	});

	const mutation = useMutation({
		mutationFn: ({
			data,
			file,
		}: {
			data: CreatePublicationPayload;
			file?: File;
		}) => createPublication(data, file),
		onSuccess: () => {
			toast.success("Publikasi berhasil dibuat");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			form.reset();
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const onSubmit = useCallback(
		(file?: File) =>
			form.handleSubmit((data) => mutation.mutate({ data, file }))(),
		[form, mutation],
	);

	return { form, mutation, onSubmit };
}

// ─── Update mutation ─────────────────────────────────────────────
export function useUpdatePublication(onSuccess?: () => void) {
	const qc = useQueryClient();
	const form = useForm<UpdatePublicationPayload>({
		resolver: zodResolver(CreatePublicationSchema),
		defaultValues: {
			title: "",
			description: "",
			documentTypeId: "",
			publish: false,
		},
	});

	const mutation = useMutation({
		mutationFn: ({
			id,
			data,
			file,
		}: {
			id: string;
			data: UpdatePublicationPayload;
			file?: File;
		}) => updatePublication(id, data, file),
		onSuccess: () => {
			toast.success("Publikasi berhasil diperbarui");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});

	const populate = useCallback(
		(pub: PublicationDto) => {
			form.reset({
				title: pub.title,
				description: pub.description ?? "",
				documentTypeId: pub.documentType?.id ?? "",
				publish: pub.status === "PUBLISHED",
			});
		},
		[form],
	);

	const onSubmit = useCallback(
		(id: string, file?: File) =>
			form.handleSubmit((data) => mutation.mutate({ id, data, file }))(),
		[form, mutation],
	);

	return { form, mutation, populate, onSubmit };
}

// ─── Delete mutation ─────────────────────────────────────────────
export function useDeletePublication(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deletePublication(id),
		onSuccess: () => {
			toast.success("Publikasi berhasil dihapus");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}

// ─── Publish mutation ────────────────────────────────────────────
export function usePublishPublication(onSuccess?: () => void) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => publishPublication(id),
		onSuccess: () => {
			toast.success("Publikasi berhasil diterbitkan");
			qc.invalidateQueries({ queryKey: [QUERY_KEY] });
			onSuccess?.();
		},
		onError: (err) => toast.error(err.message),
	});
}
