"use client";

import { IconPaperclip } from "@tabler/icons-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MailDetailDto } from "@/types/mail";

interface MailDetailProps {
	mail: MailDetailDto | null;
}

export const MailDetail = ({ mail }: MailDetailProps) => {
	if (!mail) {
		return (
			<div className="flex h-full items-center justify-center p-8 text-center bg-card rounded-lg border border-dashed">
				<div className="flex flex-col items-center gap-2">
					<div className="size-12 rounded-full bg-muted flex items-center justify-center">
						<IconPaperclip className="size-6 text-muted-foreground" />
					</div>
					<h3 className="font-medium text-foreground">Detail Surat</h3>
					<p className="text-sm text-muted-foreground max-w-[200px]">
						Silahkan pilih Mail untuk melihat isi detailnya..
					</p>
				</div>
			</div>
		);
	}

	return (
		<Card className="h-full flex flex-col shadow-none border-0 bg-card overflow-hidden">
			<CardHeader className="p-4 border-b shrink-0">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="text-[10px] uppercase font-bold"
							>
								{mail.category.name}
							</Badge>
							<span className="text-xs text-muted-foreground">
								{format(new Date(mail.mailDate), "EEEE, dd MMMM yyyy HH:mm", {
									locale: id,
								})}
							</span>
						</div>
						<CardTitle className="text-lg font-bold leading-tight">
							{mail.subject}
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Nomor:{" "}
							<span className="font-medium text-foreground">
								{mail.mailNumber}
							</span>
						</p>
					</div>
				</div>
			</CardHeader>

			<div className="flex flex-col flex-1 overflow-auto">
				<CardContent className="p-4 space-y-6">
					<div className="flex flex-col gap-1">
						<span className="text-[10px] uppercase font-bold text-muted-foreground">
							Dari
						</span>
						<p className="text-sm font-medium">{mail.audit.createdByName}</p>
					</div>

					<Separator />

					<div
						className="prose prose-sm max-w-none text-foreground"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Internal dummy content
						dangerouslySetInnerHTML={{ __html: mail.content }}
					/>

					{mail.note && (
						<div className="p-3 bg-muted/50 rounded-md border text-sm italic">
							<span className="font-bold not-italic mr-2">Catatan:</span>
							{mail.note}
						</div>
					)}
				</CardContent>
			</div>

			<div className="p-4 border-t bg-muted/30 shrink-0 flex items-center justify-between">
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<div className="flex items-center gap-1">
						<span className="font-medium">Sirkulasi:</span>
						<Badge variant="secondary" className="h-5 px-1.5 py-0">
							{mail.circulationName || "Disposisi"}
						</Badge>
					</div>
					<div className="flex items-center gap-1">
						<IconPaperclip className="size-3.5" />
						<span>{mail.summary.attachmentQty} Lampiran</span>
					</div>
				</div>
				{mail.maxResponseDate && (
					<div className="text-xs">
						<span className="text-muted-foreground">Batas Respon: </span>
						<span className="font-medium text-destructive">
							{format(new Date(mail.maxResponseDate), "dd MMM yyyy", {
								locale: id,
							})}
						</span>
					</div>
				)}
			</div>
		</Card>
	);
};
