"use client";

import { IconMessage, IconPlus, IconTemplate } from "@tabler/icons-react";
import { memo } from "react";
import { TooltipButton } from "@/components/ui/tooltip-button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataTable, DataTablePagination } from "@/components/ui/data-table";
import { useQuickMessageContent } from "@/hooks/quick-message-hooks";
import { DeleteQuickMessageDialog } from "./quick-message-delete-dialog";
import {
	CreateQuickMessageDialog,
	EditQuickMessageDialog,
} from "./quick-message-form-dialog";

export const QuickMessageContent = memo(() => {
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
		messages,
		createOpen,
		setCreateOpen,
		editQm,
		setEditQm,
		deleteQm,
		setDeleteQm,
		duplicateQm,
		setDuplicateQm,
	} = useQuickMessageContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="border-b border-border/50 pb-4">
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight text-foreground">
									<IconTemplate className="text-muted-foreground" />
									<span>Pesan Singkat</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola template pesan untuk respons lebih cepat dan efisien
								</CardDescription>
							</div>
						</div>
						<CardAction className="flex items-center gap-2">
							<TooltipButton
								onClick={() => {
									setDuplicateQm(null);
									setCreateOpen(true);
								}}
								tooltip="Tambah Pesan Singkat Baru"
								className="gap-2 shadow-sm transition-all hover:shadow-md"
								size="sm"
							>
								<IconPlus className="h-4 w-4" />
								Tambah Pesan
							</TooltipButton>
						</CardAction>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={messages}
						isLoading={isLoading}
						sorting={sorting}
						onSortingChange={setSorting}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder="Cari pesan singkat..."
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
									<IconMessage className="h-10 w-10 opacity-60" />
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada pesan singkat
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan template pesan yang sering Anda
									gunakan untuk mempercepat respons
								</p>
								<TooltipButton
									className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
									tooltip="Tambah Pesan Singkat Baru"
									onClick={() => {
										setDuplicateQm(null);
										setCreateOpen(true);
									}}
								>
									<IconPlus className="h-4 w-4" />
									Tambah Pesan Pertama
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

			<CreateQuickMessageDialog
				open={createOpen}
				onOpenChange={(v) => {
					setCreateOpen(v);
					if (!v) setDuplicateQm(null);
				}}
				defaultValues={
					duplicateQm ? { message: duplicateQm.message } : undefined
				}
			/>
			<EditQuickMessageDialog qm={editQm} onClose={() => setEditQm(null)} />
			<DeleteQuickMessageDialog
				qm={deleteQm}
				onClose={() => setDeleteQm(null)}
			/>
		</>
	);
});

QuickMessageContent.displayName = "QuickMessageContent";
