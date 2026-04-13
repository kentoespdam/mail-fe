"use client";

import { IconFileText, IconPlus } from "@tabler/icons-react";
import { memo } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataTable, DataTablePagination } from "@/components/ui/data-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { usePublicationContent } from "@/hooks/publication-hooks";
import { DeletePublicationDialog } from "./publication-delete-dialog";
import { PublicationDetailDialog } from "./publication-detail-dialog";
import {
	CreatePublicationDialog,
	EditPublicationDialog,
} from "./publication-form-dialog";
import { PublicationPreviewDialog } from "./publication-preview-dialog";
import { PublishPublicationDialog } from "./publication-publish-dialog";

export const PublicationContent = memo(() => {
	const {
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
		previewPub,
		setPreviewPub,
		canWrite,
	} = usePublicationContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="border-b border-border/50 pb-4">
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight text-foreground">
									<IconFileText
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									<span>Publikasi Dokumen</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola dokumen publikasi dan dokumentasi resmi
								</CardDescription>
							</div>
						</div>
						{canWrite && (
							<CardAction className="flex items-center gap-2">
								<TooltipButton
									onClick={() => {
										setCreateOpen(true);
									}}
									tooltip="Tambah Dokumen Publikasi Baru"
									className="gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
								>
									<IconPlus className="size-4" aria-hidden="true" />
									Tambah Dokumen
								</TooltipButton>
							</CardAction>
						)}
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={publications}
						isLoading={isLoading}
						sorting={sorting}
						onSortingChange={setSorting}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder="Cari judul publikasi ..."
						filterChildren={
							<Select value={status ?? "all"} onValueChange={setStatus}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Semua Status">
										{status === "PUBLISHED"
											? "Terbit"
											: status === "DRAFT"
												? "Draf"
												: "Semua Status"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Semua Status</SelectItem>
									<SelectItem value="PUBLISHED">Terbit</SelectItem>
									<SelectItem value="DRAFT">Draf</SelectItem>
								</SelectContent>
							</Select>
						}
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
									<IconFileText
										className="size-10 text-muted-foreground/40"
										aria-hidden="true"
									/>
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada publikasi
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									{canWrite
										? "Mulai dengan menambahkan dokumen publikasi baru"
										: "Silakan hubungi administrator untuk menambahkan dokumen"}
								</p>
								{canWrite && (
									<TooltipButton
										className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
										size="sm"
										tooltip="Tambah Dokumen Publikasi Baru"
										onClick={() => {
											setCreateOpen(true);
										}}
									>
										<IconPlus className="size-4" aria-hidden="true" />
										Tambah Publikasi Pertama
									</TooltipButton>
								)}
							</div>
						}
					/>

					{data && data.page.totalPages > 0 && (
						<DataTablePagination
							page={page}
							pageCount={data.page.totalPages}
							totalElements={data.page.totalElements}
							pageSize={pageSize}
							onPageChange={setPage}
							onPageSizeChange={setPageSize}
						/>
					)}
				</CardContent>
			</Card>

			{canWrite && (
				<>
					<CreatePublicationDialog
						open={createOpen}
						onOpenChange={(v) => {
							setCreateOpen(v);
						}}
					/>
					{editPubId && (
						<EditPublicationDialog
							pubId={editPubId}
							onClose={() => setEditPubId(null)}
						/>
					)}
					{deletePub && (
						<DeletePublicationDialog
							pub={deletePub}
							onClose={() => setDeletePub(null)}
						/>
					)}
					<PublishPublicationDialog
						pub={publishPub}
						onClose={() => setPublishPub(null)}
					/>
				</>
			)}
			<PublicationDetailDialog
				pub={detailPub}
				onClose={() => setDetailPub(null)}
			/>
			<PublicationPreviewDialog
				pub={previewPub}
				onClose={() => setPreviewPub(null)}
			/>
		</>
	);
});

PublicationContent.displayName = "PublicationContent";
