"use client";

import {
	IconMessage,
	IconPlus,
	IconTemplate,
} from "@tabler/icons-react";
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

export function QuickMessageContent() {
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

	const totalMessages = data?.totalElements ?? 0;

	return (
		<>
			<Card className="shadow-sm">
				<CardHeader className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-card to-card px-6 py-5">
					<div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
					<div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-primary/5 blur-xl" />
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-sm">
								<IconTemplate className="h-6 w-6" />
							</div>
							<div className="space-y-1">
								<CardTitle className="text-lg font-semibold tracking-tight">
									Pesan Singkat
								</CardTitle>
								<CardDescription className="text-xs leading-relaxed">
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

				<CardContent className="space-y-4 p-6">
					{totalMessages > 0 && !isLoading && (
						<div className="flex items-center justify-between rounded-md bg-muted/40 px-4 py-2.5">
							<div className="flex items-center gap-2.5">
								<div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
									<IconMessage className="h-4 w-4" />
								</div>
								<span className="text-xs font-medium text-muted-foreground">
									Total{" "}
									<span className="font-semibold text-foreground">
										{totalMessages}
									</span>{" "}
									{totalMessages === 1 ? "pesan" : "pesan"} tersimpan
								</span>
							</div>
						</div>
					)}

					<DataTable
						columns={columns}
						data={messages}
						isLoading={isLoading}
						emptyMessage={
							<div className="flex flex-col items-center justify-center py-16 text-center">
								<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/60 to-muted text-muted-foreground ring-1 ring-muted-foreground/10">
									<IconMessage className="h-10 w-10 opacity-60" />
								</div>
								<h3 className="text-base font-semibold text-foreground">
									Belum ada pesan singkat
								</h3>
								<p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
									Mulai dengan menambahkan template pesan yang sering Anda gunakan
									untuk mempercepat respons
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
}
