"use client";

import { IconFileDescription, IconPlus } from "@tabler/icons-react";
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
import { TooltipButton } from "@/components/ui/tooltip-button";
import { useDocumentTypeContent } from "@/hooks/document-type-hooks";
import { DeleteDocumentTypeDialog } from "./document-type-delete-dialog";
import {
	CreateDocumentTypeDialog,
	EditDocumentTypeDialog,
} from "./document-type-form-dialog";

export const DocumentTypeContent = memo(() => {
	const {
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
	} = useDocumentTypeContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="border-b border-border/50 pb-4">
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight text-foreground">
									<IconFileDescription
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									<span>Jenis Dokumen</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola jenis dokumen untuk klasifikasi publikasi
								</CardDescription>
							</div>
						</div>
						<CardAction className="flex items-center gap-2">
							<TooltipButton
								onClick={() => {
									setDuplicateDt(null);
									setCreateOpen(true);
								}}
								tooltip="Tambah Jenis Dokumen Baru"
								className="gap-2 shadow-sm transition-all hover:shadow-md"
								size="sm"
							>
								<IconPlus className="size-4" aria-hidden="true" />
								Tambah Jenis Dokumen
							</TooltipButton>
						</CardAction>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={documentTypes}
						isLoading={isLoading}
						sorting={sorting}
						onSortingChange={setSorting}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder="Cari jenis dokumen..."
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
									<IconFileDescription
										className="size-10 text-muted-foreground/40"
										aria-hidden="true"
									/>
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada jenis dokumen
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan jenis dokumen untuk
									mengklasifikasikan publikasi Anda
								</p>
								<TooltipButton
									className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
									tooltip="Tambah Jenis Dokumen Baru"
									onClick={() => {
										setDuplicateDt(null);
										setCreateOpen(true);
									}}
								>
									<IconPlus className="size-4" aria-hidden="true" />
									Tambah Jenis Dokumen Pertama
								</TooltipButton>
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

			<CreateDocumentTypeDialog
				open={createOpen}
				onOpenChange={(v) => {
					setCreateOpen(v);
					if (!v) setDuplicateDt(null);
				}}
				defaultValues={duplicateDt ?? undefined}
			/>
			<EditDocumentTypeDialog dt={editDt} onClose={() => setEditDt(null)} />
			<DeleteDocumentTypeDialog
				dt={deleteDt}
				onClose={() => setDeleteDt(null)}
			/>
		</>
	);
});

DocumentTypeContent.displayName = "DocumentTypeContent";
