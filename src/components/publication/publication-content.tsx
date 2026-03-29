"use client";

import { IconPlus, IconSearch } from "@tabler/icons-react";
import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePublications } from "@/hooks/publication-hooks";
import type {
	PublicationDto,
	PublicationFilter,
	PublicationStatus,
} from "@/types/publication";
import { DeletePublicationDialog } from "./publication-delete-dialog";
import {
	CreatePublicationDialog,
	EditPublicationDialog,
} from "./publication-form-dialog";
import { PublicationTable } from "./publication-table";

const LIMIT = 20;

export const PublicationContent = memo(() => {
	const [filter, setFilter] = useState<PublicationFilter>({});
	const [keyword, setKeyword] = useState("");
	const [offset, setOffset] = useState(0);

	const { data: publications, isLoading } = usePublications(
		filter,
		offset,
		LIMIT,
	);

	const [createOpen, setCreateOpen] = useState(false);
	const [editPub, setEditPub] = useState<PublicationDto | null>(null);
	const [deletePub, setDeletePub] = useState<PublicationDto | null>(null);

	const handleSearch = useCallback(() => {
		setOffset(0);
		setFilter((f) => ({ ...f, keyword: keyword || undefined }));
	}, [keyword]);

	const handleStatusFilter = useCallback((status?: PublicationStatus) => {
		setOffset(0);
		setFilter((f) => ({ ...f, status }));
	}, []);

	const totalCount = publications?.[0]?.totalCount ?? 0;
	const hasNext = publications?.length === LIMIT;
	const hasPrev = offset > 0;

	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Publikasi Dokumen</CardTitle>
					<CardAction>
						<Button onClick={() => setCreateOpen(true)}>
							<IconPlus data-icon="inline-start" />
							Tambah
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-3">
					{/* Filters */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-1">
							<Input
								placeholder="Cari judul…"
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								className="w-56"
							/>
							<Button variant="outline" size="icon" onClick={handleSearch}>
								<IconSearch />
							</Button>
						</div>
						<div className="flex gap-1">
							<Button
								variant={!filter.status ? "default" : "outline"}
								size="sm"
								onClick={() => handleStatusFilter()}
							>
								Semua
							</Button>
							<Button
								variant={filter.status === "PUBLISHED" ? "default" : "outline"}
								size="sm"
								onClick={() => handleStatusFilter("PUBLISHED")}
							>
								Terbit
							</Button>
							<Button
								variant={filter.status === "DRAFT" ? "default" : "outline"}
								size="sm"
								onClick={() => handleStatusFilter("DRAFT")}
							>
								Draf
							</Button>
						</div>
					</div>

					<PublicationTable
						publications={publications}
						isLoading={isLoading}
						offset={offset}
						onEdit={setEditPub}
						onDelete={setDeletePub}
					/>

					{/* Pagination */}
					{(hasPrev || hasNext) && (
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">
								{totalCount > 0 && `Total: ${totalCount}`}
							</span>
							<div className="flex gap-1">
								<Button
									variant="outline"
									size="sm"
									disabled={!hasPrev}
									onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
								>
									Sebelumnya
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={!hasNext}
									onClick={() => setOffset((o) => o + LIMIT)}
								>
									Berikutnya
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<CreatePublicationDialog open={createOpen} onOpenChange={setCreateOpen} />
			<EditPublicationDialog pub={editPub} onClose={() => setEditPub(null)} />
			<DeletePublicationDialog
				pub={deletePub}
				onClose={() => setDeletePub(null)}
			/>
		</>
	);
});

PublicationContent.displayName = "PublicationContent";
