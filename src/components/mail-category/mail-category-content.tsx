"use client";

import { IconCategory, IconPlus } from "@tabler/icons-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
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
import { useMailCategoryContent } from "@/hooks/mail-category-hooks";
import { DeleteMailCategoryDialog } from "./mail-category-delete-dialog";
import {
	CreateMailCategoryDialog,
	EditMailCategoryDialog,
} from "./mail-category-form-dialog";

export const MailCategoryContent = memo(() => {
	const {
		page,
		setPage,
		pageSize,
		setPageSize,
		sorting,
		setSorting,
		searchValue,
		setSearchValue,
		mailTypeId,
		setMailTypeId,
		mailTypeOptions,
		data,
		isLoading,
		columns,
		mailCategories,
		createOpen,
		setCreateOpen,
		editMc,
		setEditMc,
		deleteMc,
		setDeleteMc,
	} = useMailCategoryContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="border-b border-border/50 pb-4">
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight text-foreground">
									<IconCategory className="text-muted-foreground" />
									<span>Kategori Surat</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola kategori surat berdasarkan tipe surat
								</CardDescription>
							</div>
						</div>
						<CardAction className="flex items-center gap-2">
							<Button
								onClick={() => setCreateOpen(true)}
								className="gap-2 shadow-sm transition-all hover:shadow-md"
								size="sm"
							>
								<IconPlus className="h-4 w-4" />
								Tambah Kategori Surat
							</Button>
						</CardAction>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={mailCategories}
						isLoading={isLoading}
						sorting={sorting}
						onSortingChange={setSorting}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder="Cari kategori surat..."
						filterChildren={
							<Select
								value={mailTypeId ? String(mailTypeId) : "all"}
								onValueChange={(v) =>
									setMailTypeId(v === "all" ? undefined : Number(v))
								}
							>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Semua Tipe Surat">
										{mailTypeId
											? mailTypeOptions.find(
													(opt: { value: number; label: string }) =>
														opt.value === mailTypeId,
											  )?.label
											: "Semua Tipe Surat"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Semua Tipe Surat</SelectItem>
									{mailTypeOptions.map((opt: { value: number; label: string }) => (
										<SelectItem key={opt.value} value={String(opt.value)}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						}
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
									<IconCategory className="h-10 w-10 opacity-60" />
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada kategori surat
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan kategori surat untuk
									mengklasifikasikan persuratan Anda
								</p>
								<Button
									className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
									onClick={() => setCreateOpen(true)}
								>
									<IconPlus className="h-4 w-4" />
									Tambah Kategori Surat Pertama
								</Button>
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

			<CreateMailCategoryDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
			<EditMailCategoryDialog mcId={editMc} onClose={() => setEditMc(null)} />
			<DeleteMailCategoryDialog
				mc={deleteMc}
				onClose={() => setDeleteMc(null)}
			/>
		</>
	);
});

MailCategoryContent.displayName = "MailCategoryContent";
