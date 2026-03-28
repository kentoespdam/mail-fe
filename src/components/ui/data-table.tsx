"use client";

import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type Table as TanstackTable,
	useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// ─── Generic DataTable ──────────────────────────────────────────

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	emptyMessage?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading,
	emptyMessage = "Tidak ada data.",
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground"
							>
								Memuat data…
							</TableCell>
						</TableRow>
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground"
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

// ─── Server-side Pagination ─────────────────────────────────────

interface DataTablePaginationProps {
	page: number;
	pageCount: number;
	totalElements: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
}

export function DataTablePagination({
	page,
	pageCount,
	totalElements,
	pageSize,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = [10, 20, 50, 100],
}: DataTablePaginationProps) {
	const canPrev = page > 0;
	const canNext = page < pageCount - 1;

	return (
		<div className="flex items-center justify-between gap-4 pt-3">
			<p className="text-xs text-muted-foreground shrink-0">
				{totalElements > 0
					? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, totalElements)} dari ${totalElements}`
					: "0 data"}
			</p>

			<div className="flex items-center gap-4">
				{onPageSizeChange && (
					<div className="flex items-center gap-1.5">
						<p className="text-xs text-muted-foreground whitespace-nowrap">
							Baris per halaman
						</p>
						<Select
							value={String(pageSize)}
							onValueChange={(v) => {
								onPageSizeChange(Number(v));
								onPageChange(0);
							}}
						>
							<SelectTrigger size="sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="end">
								{pageSizeOptions.map((s) => (
									<SelectItem key={s} value={String(s)}>
										{s}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				<div className="flex items-center gap-1.5">
					<p className="text-xs text-muted-foreground whitespace-nowrap">
						Hal. {page + 1} dari {Math.max(pageCount, 1)}
					</p>
					<div className="flex items-center gap-0.5">
						<Button
							variant="outline"
							size="icon-xs"
							disabled={!canPrev}
							onClick={() => onPageChange(0)}
							title="Halaman pertama"
						>
							<IconChevronsLeft />
						</Button>
						<Button
							variant="outline"
							size="icon-xs"
							disabled={!canPrev}
							onClick={() => onPageChange(page - 1)}
							title="Sebelumnya"
						>
							<IconChevronLeft />
						</Button>
						<Button
							variant="outline"
							size="icon-xs"
							disabled={!canNext}
							onClick={() => onPageChange(page + 1)}
							title="Berikutnya"
						>
							<IconChevronRight />
						</Button>
						<Button
							variant="outline"
							size="icon-xs"
							disabled={!canNext}
							onClick={() => onPageChange(pageCount - 1)}
							title="Halaman terakhir"
						>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
