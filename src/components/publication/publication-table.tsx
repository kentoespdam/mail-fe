"use client";

import { IconFile, IconPencil, IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { PublicationDto } from "@/types/publication";

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

const formatDate = (iso: string | null) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const formatFileSize = (bytes: number | null) => {
	if (!bytes) return "—";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface PublicationTableProps {
	publications: PublicationDto[] | undefined;
	isLoading: boolean;
	offset: number;
	onEdit: (pub: PublicationDto) => void;
	onDelete: (pub: PublicationDto) => void;
}

export const PublicationTable = memo(
	({
		publications,
		isLoading,
		offset,
		onEdit,
		onDelete,
	}: PublicationTableProps) => {
		return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-10">#</TableHead>
						<TableHead>Judul</TableHead>
						<TableHead>Tipe</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>File</TableHead>
						<TableHead>Dibuat</TableHead>
						<TableHead className="w-20 text-right">Aksi</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading && (
						<TableRow>
							<TableCell
								colSpan={7}
								className="py-8 text-center text-muted-foreground"
							>
								Memuat data…
							</TableCell>
						</TableRow>
					)}
					{!isLoading && !publications?.length && (
						<TableRow>
							<TableCell
								colSpan={7}
								className="py-8 text-center text-muted-foreground"
							>
								Tidak ada data publikasi
							</TableCell>
						</TableRow>
					)}
					{publications?.map((pub, i) => (
						<TableRow key={pub.id}>
							<TableCell>{offset + i + 1}</TableCell>
							<TableCell className="max-w-xs truncate font-medium">
								{pub.title}
							</TableCell>
							<TableCell>{pub.documentTypeName ?? "—"}</TableCell>
							<TableCell>{statusBadge(pub.status)}</TableCell>
							<TableCell>
								{pub.fileName ? (
									<span className="flex items-center gap-1">
										<IconFile className="size-3.5" aria-hidden="true" />
										<span className="max-w-24 truncate">{pub.fileName}</span>
										<span className="text-muted-foreground">
											({formatFileSize(pub.fileSize)})
										</span>
									</span>
								) : (
									"—"
								)}
							</TableCell>
							<TableCell>{formatDate(pub.createdAt)}</TableCell>
							<TableCell>
								<div className="flex justify-end gap-1">
									<Button
										variant="ghost"
										size="icon-xs"
										onClick={() => onEdit(pub)}
										title="Edit"
										className="text-primary hover:bg-primary/10 hover:text-primary"
									>
										<IconPencil className="size-4" aria-hidden="true" />
									</Button>
									<Button
										variant="ghost"
										size="icon-xs"
										onClick={() => onDelete(pub)}
										title="Hapus"
										className="text-destructive hover:bg-destructive/10 hover:text-destructive"
									>
										<IconTrash className="size-4" aria-hidden="true" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	},
);

PublicationTable.displayName = "PublicationTable";
