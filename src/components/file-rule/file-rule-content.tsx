"use client";

import { IconFileSettings, IconPlus } from "@tabler/icons-react";
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
import { useFileRuleContent } from "@/hooks/file-rule-hooks";
import { DeleteFileRuleDialog } from "./file-rule-delete-dialog";
import {
	CreateFileRuleDialog,
	EditFileRuleDialog,
} from "./file-rule-form-dialog";

export const FileRuleContent = memo(() => {
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
		fileRules,
		createOpen,
		setCreateOpen,
		editFr,
		setEditFr,
		deleteFr,
		setDeleteFr,
	} = useFileRuleContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="border-b border-border/50 pb-4">
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight text-foreground">
									<IconFileSettings
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
									<span>Aturan File</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola aturan tipe file dan batas ukuran maksimal
								</CardDescription>
							</div>
						</div>
						<CardAction className="flex items-center gap-2">
							<TooltipButton
								onClick={() => setCreateOpen(true)}
								tooltip="Tambah Aturan File Baru"
								className="gap-2 shadow-sm transition-all hover:shadow-md"
								size="sm"
							>
								<IconPlus className="size-4" aria-hidden="true" />
								Tambah Aturan File
							</TooltipButton>
						</CardAction>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={fileRules}
						isLoading={isLoading}
						sorting={sorting}
						onSortingChange={setSorting}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder="Cari aturan file..."
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
									<IconFileSettings
										className="size-10 text-muted-foreground/40"
										aria-hidden="true"
									/>
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada aturan file
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan aturan tipe file yang diperbolehkan
								</p>
								<TooltipButton
									className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
									tooltip="Tambah Aturan File Baru"
									onClick={() => setCreateOpen(true)}
								>
									<IconPlus className="size-4" aria-hidden="true" />
									Tambah Aturan File Pertama
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

			<CreateFileRuleDialog open={createOpen} onOpenChange={setCreateOpen} />
			<EditFileRuleDialog fr={editFr} onClose={() => setEditFr(null)} />
			<DeleteFileRuleDialog fr={deleteFr} onClose={() => setDeleteFr(null)} />
		</>
	);
});

FileRuleContent.displayName = "FileRuleContent";
