"use client";

import {
	IconSelector,
	IconSortAscending,
	IconSortDescending,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type Row,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	StickyTable,
	StickyTableBody,
	StickyTableCell,
	StickyTableHead,
	StickyTableHeader,
	StickyTableRoot,
	StickyTableRow,
} from "@/components/ui/sticky-table";
import { cn } from "@/lib/utils";

/**
 * StickyDataTable Component
 *
 * A reusable data table component that integrates TanStack Table with StickyTable primitives.
 * Provides a sticky header that stays visible while scrolling the table body.
 *
 * JSDoc: Opsi A - Komponen baru StickyDataTable yang reusable.
 * Menjembatani TanStack Table + primitif StickyTable.
 */

interface StickyDataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	emptyMessage?: React.ReactNode;

	// Sorting
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;

	// Events
	onRowClick?: (row: Row<TData>) => void;
	getRowClassName?: (row: Row<TData>) => string;

	// Styling
	className?: string;
}

function StickyDataTableComponent<TData, TValue>({
	columns,
	data,
	isLoading,
	emptyMessage = "Tidak ada data.",
	sorting,
	onSortingChange,
	onRowClick,
	getRowClassName,
	className,
}: StickyDataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting: sorting ?? [],
		},
		onSortingChange,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualPagination: true, // Pagination handled externally
	});

	return (
		<StickyTableRoot className={cn("h-full", className)}>
			<StickyTable>
				<StickyTableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<StickyTableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const isSortable = header.column.getCanSort();

								return (
									<StickyTableHead
										key={header.id}
										className="whitespace-nowrap"
									>
										{header.isPlaceholder ? null : isSortable ? (
											<button
												type="button"
												className="flex cursor-pointer select-none items-center gap-2 hover:text-foreground transition-colors group w-full"
												onClick={header.column.getToggleSortingHandler()}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{header.column.getIsSorted() === "asc" ? (
													<IconSortAscending
														className="size-4 text-primary"
														aria-hidden="true"
													/>
												) : header.column.getIsSorted() === "desc" ? (
													<IconSortDescending
														className="size-4 text-primary"
														aria-hidden="true"
													/>
												) : (
													<IconSelector
														className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
														aria-hidden="true"
													/>
												)}
											</button>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)
										)}
									</StickyTableHead>
								);
							})}
						</StickyTableRow>
					))}
				</StickyTableHeader>
				<StickyTableBody>
					{isLoading ? (
						Array.from({ length: 10 }).map((_, rowIndex) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton rows are static placeholders
							<StickyTableRow key={`skeleton-row-${rowIndex}`}>
								{columns.map((_col, colIndex) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton columns are static placeholders
									<StickyTableCell key={`skeleton-${colIndex}`}>
										<Skeleton
											className={`h-4 ${colIndex === 0 ? "w-8" : "w-32"}`}
										/>
									</StickyTableCell>
								))}
							</StickyTableRow>
						))
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<StickyTableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								onClick={() => onRowClick?.(row)}
								className={cn(
									onRowClick && "cursor-pointer",
									getRowClassName?.(row),
								)}
							>
								{row.getVisibleCells().map((cell) => (
									<StickyTableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</StickyTableCell>
								))}
							</StickyTableRow>
						))
					) : (
						<StickyTableRow>
							<StickyTableCell
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground"
							>
								{emptyMessage}
							</StickyTableCell>
						</StickyTableRow>
					)}
				</StickyTableBody>
			</StickyTable>
		</StickyTableRoot>
	);
}

StickyDataTableComponent.displayName = "StickyDataTable";

export const StickyDataTable = memo(
	StickyDataTableComponent,
) as typeof StickyDataTableComponent;
