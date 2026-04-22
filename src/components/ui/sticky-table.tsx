"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * StickyTable Component
 *
 * A reusable table component with a sticky header and responsive horizontal scroll.
 * Follows shadcn/ui composition pattern and uses Tailwind v4 tokens.
 *
 * Decision: Single-scroll container with overflow: auto.
 * Header uses position: sticky; top: 0; z-index: 10.
 * Background must be solid (bg-background) to prevent content overlap during scroll.
 */

interface StickyTableRootProps extends React.ComponentProps<"div"> {
	maxHeight?: string | number;
}

/**
 * Root container for StickyTable. Handles overflow and optional maxHeight.
 */
const StickyTableRoot = React.forwardRef<HTMLDivElement, StickyTableRootProps>(
	({ className, maxHeight, style, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="sticky-table-root"
			className={cn(
				"relative w-full overflow-auto rounded-md border",
				className,
			)}
			style={{ maxHeight, ...style }}
			{...props}
		/>
	),
);
StickyTableRoot.displayName = "StickyTableRoot";

/**
 * The main table element.
 */
const StickyTable = React.forwardRef<
	HTMLTableElement,
	React.ComponentProps<"table">
>(({ className, ...props }, ref) => (
	<table
		ref={ref}
		data-slot="sticky-table"
		className={cn("w-full caption-bottom text-xs", className)}
		{...props}
	/>
));
StickyTable.displayName = "StickyTable";

/**
 * Sticky header for the table. Stays at the top of the nearest scroll container.
 */
const StickyTableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.ComponentProps<"thead">
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		data-slot="sticky-table-header"
		className={cn(
			"sticky top-0 z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)] [&_tr]:border-b-0",
			className,
		)}
		{...props}
	/>
));
StickyTableHeader.displayName = "StickyTableHeader";

/**
 * The table body.
 */
const StickyTableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.ComponentProps<"tbody">
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		data-slot="sticky-table-body"
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
));
StickyTableBody.displayName = "StickyTableBody";

/**
 * The table footer.
 */
const StickyTableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.ComponentProps<"tfoot">
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		data-slot="sticky-table-footer"
		className={cn(
			"border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
));
StickyTableFooter.displayName = "StickyTableFooter";

/**
 * A row in the table.
 */
const StickyTableRow = React.forwardRef<
	HTMLTableRowElement,
	React.ComponentProps<"tr">
>(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		data-slot="sticky-table-row"
		className={cn(
			"border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
			className,
		)}
		{...props}
	/>
));
StickyTableRow.displayName = "StickyTableRow";

/**
 * A header cell. Solid background is required for sticky headers.
 */
const StickyTableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ComponentProps<"th">
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		data-slot="sticky-table-head"
		className={cn(
			"h-10 px-2 text-sm text-left align-middle font-medium whitespace-nowrap text-foreground bg-background [&:has([role=checkbox])]:pr-0",
			className,
		)}
		{...props}
	/>
));
StickyTableHead.displayName = "StickyTableHead";

/**
 * A data cell in the table body.
 */
const StickyTableCell = React.forwardRef<
	HTMLTableCellElement,
	React.ComponentProps<"td">
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		data-slot="sticky-table-cell"
		className={cn(
			"px-2 py-0.5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
			className,
		)}
		{...props}
	/>
));
StickyTableCell.displayName = "StickyTableCell";

/**
 * Optional caption for the table.
 */
const StickyTableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.ComponentProps<"caption">
>(({ className, ...props }, ref) => (
	<caption
		ref={ref}
		data-slot="sticky-table-caption"
		className={cn("mt-4 text-xs text-muted-foreground", className)}
		{...props}
	/>
));
StickyTableCaption.displayName = "StickyTableCaption";

export {
	StickyTableRoot,
	StickyTable,
	StickyTableHeader,
	StickyTableBody,
	StickyTableFooter,
	StickyTableHead,
	StickyTableRow,
	StickyTableCell,
	StickyTableCaption,
};
