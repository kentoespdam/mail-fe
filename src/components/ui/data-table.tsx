"use client";

import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconSearch,
	IconSelector,
	IconSortAscending,
	IconSortDescending,
	IconX,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type RowSelectionState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

	// Sorting
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;

	// Filtering / Search
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	filterChildren?: React.ReactNode;

	// Row Selection / Bulk Actions
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;
	bulkActionChildren?: React.ReactNode;
}

function DataTableComponent<TData, TValue>({
	columns,
	data,
	isLoading,
	emptyMessage = "Tidak ada data.",
	sorting,
	onSortingChange,
	searchValue,
	onSearchChange,
	searchPlaceholder = "Cari data...",
	filterChildren,
	rowSelection,
	onRowSelectionChange,
	bulkActionChildren,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting: sorting ?? [],
			rowSelection: rowSelection ?? {},
		},
		onSortingChange,
		onRowSelectionChange,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const isRowSelected =
		table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

	return (
		<div className="space-y-4">
			{/* Toolbar (Search & Filter) */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					{onSearchChange && (
						<div className="relative w-full max-w-sm">
							<IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={searchPlaceholder}
								value={searchValue ?? ""}
								onChange={(event) => onSearchChange(event.target.value)}
								className="pl-9 pr-9"
							/>
							{(searchValue ?? "").length > 0 && (
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-1 top-1 h-7 w-7"
									onClick={() => onSearchChange("")}
								>
									<IconX className="h-4 w-4" />
								</Button>
							)}
						</div>
					)}
					{filterChildren}
				</div>

				{/* Bulk Action Slot */}
				{isRowSelected && bulkActionChildren && (
					<div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
						{bulkActionChildren}
					</div>
				)}
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const isSortable = header.column.getCanSort();

									return (
										<TableHead key={header.id} className="whitespace-nowrap">
											{header.isPlaceholder ? null : (
												<div
													className={
														isSortable
															? "flex cursor-pointer select-none items-center gap-2 hover:text-foreground transition-colors group"
															: ""
													}
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{isSortable &&
														(header.column.getIsSorted() === "asc" ? (
															<IconSortAscending className="h-4 w-4 text-primary" />
														) : header.column.getIsSorted() === "desc" ? (
															<IconSortDescending className="h-4 w-4 text-primary" />
														) : (
															<IconSelector className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
														))}
												</div>
											)}
										</TableHead>
									);
								})}
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
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
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
		</div>
	);
}

DataTableComponent.displayName = "DataTable";

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

// ─── Server-side Pagination ─────────────────────────────────────

interface DataTablePaginationProps {
	page: number;
	pageCount: number;
	totalElements: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	extraChildren?: React.ReactNode;
}

function DataTablePaginationComponent(props: DataTablePaginationProps) {
	const {
		page,
		pageCount,
		totalElements,
		pageSize,
		onPageChange,
		onPageSizeChange,
		pageSizeOptions = [10, 20, 50, 100],
		extraChildren,
	} = props;
	const canPrev = page > 0;
	const canNext = page < pageCount - 1;

	return (
		<div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-4">
				<p className="text-xs text-muted-foreground shrink-0 order-2 sm:order-1">
					{totalElements > 0
						? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, totalElements)} dari ${totalElements}`
						: "0 data"}
				</p>
				{extraChildren && (
					<div className="order-1 sm:order-2">{extraChildren}</div>
				)}
			</div>

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

export const DataTablePagination = memo(DataTablePaginationComponent);

DataTablePaginationComponent.displayName = "DataTablePagination";
