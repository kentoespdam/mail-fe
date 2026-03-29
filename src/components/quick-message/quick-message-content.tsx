"use client";

import { IconMessage, IconPlus, IconTemplate } from "@tabler/icons-react";
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
	} = useQuickMessageContent();

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader>
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="space-y-1">
								<CardTitle className="flex gap-2 items-center text-lg font-semibold tracking-tight">
									<IconTemplate />
									<span>Pesan Singkat</span>
								</CardTitle>
								<CardDescription className="leading-relaxed">
									Kelola template pesan untuk respons lebih cepat dan efisien
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
								Tambah Pesan
							</Button>
						</CardAction>
					</div>
				</CardHeader>

				<CardContent className="space-y-4 p-2">
					<DataTable
						columns={columns}
						data={messages}
						isLoading={isLoading}
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-muted/60 to-muted text-muted-foreground ring-1 ring-muted-foreground/10">
									<IconMessage className="h-10 w-10 opacity-60" />
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada pesan singkat
								</h3>
								<p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan template pesan yang sering Anda
									gunakan untuk mempercepat respons
								</p>
								<Button
									className="mt-6 gap-2 shadow-sm transition-all hover:shadow-md"
									size="sm"
									onClick={() => setCreateOpen(true)}
								>
									<IconPlus className="h-4 w-4" />
									Tambah Pesan Pertama
								</Button>
							</div>
						}
					/>

					{data && data.totalPages > 0 && (
						<DataTablePagination
							page={page}
							pageCount={data.totalPages}
							totalElements={data.totalElements}
							pageSize={pageSize}
							onPageChange={setPage}
							onPageSizeChange={setPageSize}
						/>
					)}
				</CardContent>
			</Card>

			<CreateQuickMessageDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
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
