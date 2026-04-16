"use client";

import type {
	ColumnDef,
	OnChangeFn,
	SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTablePagination } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import type { MailSummaryDto } from "@/types/mail";

interface MailListProps {
	mails: MailSummaryDto[];
	isLoading?: boolean;
	selectedMailId: string | null;
	onSelectMail: (mailId: string) => void;
	page: number;
	pageSize: number;
	totalElements: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
}

const columns: ColumnDef<MailSummaryDto>[] = [
	{
		accessorKey: "mailDate",
		header: "Tgl Pengiriman",
		enableSorting: true,
		cell: ({ row }) => {
			const mail = row.original;
			const isUnread = mail.readStatus === 0;
			return (
				<div className="flex items-center gap-2 py-0.5">
					{isUnread && (
						<div className="size-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
					)}
					<span className="whitespace-nowrap">
						{format(new Date(mail.mailDate), "dd/MM/yyyy HH:mm", {
							locale: id,
						})}
					</span>
				</div>
			);
		},
	},
	{
		accessorFn: (row) => row.audit.createdByName,
		id: "sender",
		header: "Pengirim",
		enableSorting: true,
		cell: ({ row }) => (
			<div
				className="whitespace-nowrap truncate max-w-[120px]"
				title={row.original.audit.createdByName}
			>
				{row.original.audit.createdByName}
			</div>
		),
	},
	{
		accessorKey: "subject",
		header: "Perihal",
		enableSorting: true,
		cell: ({ row }) => {
			const mail = row.original;
			const isUnread = mail.readStatus === 0;
			return (
				<div
					className={cn(
						"max-w-[300px] truncate group-hover:text-primary transition-colors py-0.5",
						isUnread && "font-bold text-foreground",
					)}
					title={mail.subject}
				>
					{mail.subject}
				</div>
			);
		},
	},
	{
		accessorFn: (row) => row.type.name,
		id: "type",
		header: "Tipe",
		enableSorting: false,
		cell: ({ row }) => (
			<span className="whitespace-nowrap">{row.original.type.name}</span>
		),
	},
	{
		accessorFn: (row) => row.category.name,
		id: "category",
		header: "Jenis",
		enableSorting: false,
		cell: ({ row }) => (
			<Badge
				variant="outline"
				className="text-[9px] px-1 py-0 h-4 font-bold uppercase leading-none"
			>
				{row.original.category.name}
			</Badge>
		),
	},
	{
		accessorKey: "circulationName",
		header: "Sirkulasi",
		enableSorting: false,
		cell: ({ row }) => (
			<span className="whitespace-nowrap">{row.original.circulationName}</span>
		),
	},
	{
		accessorKey: "maxResponseDate",
		header: "Batas Respon",
		enableSorting: true,
		cell: ({ row }) => {
			const date = row.original.maxResponseDate;
			if (!date) return <span className="text-muted-foreground">-</span>;
			return (
				<span className="text-destructive font-medium whitespace-nowrap">
					{format(new Date(date), "dd/MM/yyyy", { locale: id })}
				</span>
			);
		},
	},
];

export const MailList = memo(
	({
		mails,
		isLoading,
		selectedMailId,
		onSelectMail,
		page,
		pageSize,
		totalElements,
		onPageChange,
		onPageSizeChange,
		sorting,
		onSortingChange,
	}: MailListProps) => {
		const pageCount = Math.ceil(totalElements / pageSize);

		return (
			<div className="flex flex-col gap-2 h-full overflow-hidden">
				<div className="flex-1 overflow-auto bg-card rounded-md border shadow-sm">
					<DataTable
						columns={columns}
						data={mails}
						isLoading={isLoading}
						sorting={sorting}
						onSortingChange={onSortingChange}
						emptyMessage="Tidak ada surat."
						onRowClick={(row) => onSelectMail(row.original.id)}
						getRowClassName={(row) =>
							cn(
								"text-xs transition-colors hover:bg-muted/50 group",
								selectedMailId === row.original.id &&
									"bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary",
								row.original.readStatus !== 0 && "text-muted-foreground",
							)
						}
					/>
				</div>
				<DataTablePagination
					page={page}
					pageCount={pageCount}
					totalElements={totalElements}
					pageSize={pageSize}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
				/>
			</div>
		);
	},
);

MailList.displayName = "MailList";
