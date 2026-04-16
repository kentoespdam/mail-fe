"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/ui/data-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
		const pageCount = Math.ceil(totalElements / pageSize);

		return (
			<div className="flex flex-col gap-4 h-full">
				<div className="flex-1 overflow-auto rounded-md border bg-card shadow-sm">
					<Table>
						<TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
							<TableRow>
								<TableHead className="w-45">Tgl Pengiriman</TableHead>
								<TableHead className="w-37.5">Pengirim</TableHead>
								<TableHead className="min-w-62.5">Perihal</TableHead>
								<TableHead>Tipe</TableHead>
								<TableHead>Jenis</TableHead>
								<TableHead>Sirkulasi</TableHead>
								<TableHead className="text-right">Batas Respon</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center">
										Memuat data...
									</TableCell>
								</TableRow>
							) : mails.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center">
										Tidak ada surat.
									</TableCell>
								</TableRow>
							) : (
								mails.map((mail) => {
									const isSelected = selectedMailId === mail.id;
									const isUnread = mail.readStatus === 0;

									return (
										<TableRow
											key={mail.id}
											className={cn(
												"cursor-pointer transition-all hover:bg-muted/50 group",
												isSelected &&
												"bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary",
												!isUnread && "text-muted-foreground",
											)}
											onClick={() => onSelectMail(mail.id)}
										>
											<TableCell className="font-medium whitespace-nowrap py-3">
												<div className="flex items-center gap-2">
													{isUnread && (
														<div className="size-2 rounded-full bg-primary shrink-0 animate-pulse" />
													)}
													{format(new Date(mail.mailDate), "dd/MM/yyyy HH:mm", {
														locale: id,
													})}
												</div>
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{mail.audit.createdByName}
											</TableCell>
											<TableCell>
												<div
													className={cn(
														"max-w-100 truncate group-hover:text-primary transition-colors",
														isUnread && "font-bold text-foreground",
													)}
													title={mail.subject}
												>
													{mail.subject}
												</div>
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{mail.type.name}
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className="text-[10px] font-bold uppercase"
												>
													{mail.category.name}
												</Badge>
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{mail.circulationName}
											</TableCell>
											<TableCell className="text-right whitespace-nowrap">
												{mail.maxResponseDate ? (
													<span className="text-destructive font-medium">
														{format(
															new Date(mail.maxResponseDate),
															"dd/MM/yyyy",
															{
																locale: id,
															},
														)}
													</span>
												) : (
													"-"
												)}
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
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
