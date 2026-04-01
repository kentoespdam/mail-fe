"use client";

import { IconMail, IconPlus } from "@tabler/icons-react";
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
import { useMailTypeContent } from "@/hooks/mail-type-hooks";
import { DeleteMailTypeDialog } from "./mail-type-delete-dialog";
import {
	CreateMailTypeDialog,
	EditMailTypeDialog,
} from "./mail-type-form-dialog";

export const MailTypeContent = memo(() => {
	const {
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
	} = useMailTypeContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="border-b border-border/50 pb-4">
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight text-foreground">
									<IconMail className="text-muted-foreground" />
									<span>Tipe Surat</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola tipe surat untuk klasifikasi persuratan
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
								Tambah Tipe Surat
							</Button>
						</CardAction>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={mailTypes}
						isLoading={isLoading}
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground ring-1 ring-border">
									<IconMail className="h-10 w-10 opacity-60" />
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada tipe surat
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan tipe surat untuk mengklasifikasikan
									persuratan Anda
								</p>
								<Button
									className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
									onClick={() => setCreateOpen(true)}
								>
									<IconPlus className="h-4 w-4" />
									Tambah Tipe Surat Pertama
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

			<CreateMailTypeDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
			<EditMailTypeDialog mt={editMt} onClose={() => setEditMt(null)} />
			<DeleteMailTypeDialog
				mt={deleteMt}
				onClose={() => setDeleteMt(null)}
			/>
		</>
	);
});

MailTypeContent.displayName = "MailTypeContent";
