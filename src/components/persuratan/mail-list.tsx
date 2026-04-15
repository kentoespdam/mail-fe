"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { memo, useMemo } from "react";
import { DataTablePagination } from "@/components/ui/data-table";
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
}

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
	}: MailListProps) => {
		const columns = useMemo<ColumnDef<MailSummaryDto>[]>(
			() => [
				{
					accessorKey: "mailDate",
					header: "Tgl Pengiriman",
					cell: ({ row }) => {
						const date = row.original.mailDate;
						return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: id });
					},
				},
				{
					accessorKey: "audit.createdByName",
					header: "Pengirim",
				},
				{
					accessorKey: "subject",
					header: "Perihal",
					cell: ({ row }) => (
						<div
							className="max-w-[300px] truncate"
							title={row.original.subject}
						>
							{row.original.subject}
						</div>
					),
				},
				{
					accessorKey: "type.name",
					header: "Tipe",
				},
				{
					accessorKey: "category.name",
					header: "Jenis",
				},
				{
					accessorKey: "circulationName",
					header: "Sirkulasi",
				},
				{
					accessorKey: "maxResponseDate",
					header: "Batas Respon",
					cell: ({ row }) => {
						const date = row.original.maxResponseDate;
						return date
							? format(new Date(date), "dd/MM/yyyy", { locale: id })
							: "-";
					},
				},
			],
			[],
		);

		const pageCount = Math.ceil(totalElements / pageSize);

		return (
			<div className="flex flex-col gap-4 h-full">
				<div className="flex-1 overflow-auto rounded-md border bg-card">
					<table className="w-full text-sm">
						<thead className="sticky top-0 bg-muted/50 text-muted-foreground border-b z-10">
							<tr>
								{columns.map((col, i) => (
									<th
										key={i.toString()}
										className="h-10 px-4 text-left align-middle font-medium whitespace-nowrap"
									>
										{typeof col.header === "string" ? col.header : ""}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td
										colSpan={columns.length}
										className="h-24 text-center align-middle"
									>
										Memuat data...
									</td>
								</tr>
							) : mails.length === 0 ? (
								<tr>
									<td
										colSpan={columns.length}
										className="h-24 text-center align-middle"
									>
										Tidak ada surat.
									</td>
								</tr>
							) : (
								mails.map((mail) => {
									const isSelected = selectedMailId === mail.id;
									const isUnread = mail.readStatus === 0;

									return (
										<tr
											key={mail.id}
											className={cn(
												"border-b transition-colors hover:bg-muted/50 cursor-pointer",
												isSelected && "bg-accent text-accent-foreground",
												isUnread && "font-bold",
											)}
											onClick={() => onSelectMail(mail.id)}
										>
											<td className="p-4 align-middle whitespace-nowrap">
												{format(new Date(mail.mailDate), "dd/MM/yyyy HH:mm", {
													locale: id,
												})}
											</td>
											<td className="p-4 align-middle">
												{mail.audit.createdByName}
											</td>
											<td className="p-4 align-middle">
												<div
													className="max-w-[300px] truncate"
													title={mail.subject}
												>
													{mail.subject}
												</div>
											</td>
											<td className="p-4 align-middle">{mail.type.name}</td>
											<td className="p-4 align-middle">{mail.category.name}</td>
											<td className="p-4 align-middle">
												{mail.circulationName}
											</td>
											<td className="p-4 align-middle whitespace-nowrap">
												{mail.maxResponseDate
													? format(
															new Date(mail.maxResponseDate),
															"dd/MM/yyyy",
															{
																locale: id,
															},
														)
													: "-"}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
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
