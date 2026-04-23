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
			<div className="flex h-full items-center justify-center p-4 text-center bg-muted/5 rounded-lg border border-dashed m-1">
				<p className="text-xs text-muted-foreground">
					Silahkan pilih Mail untuk melihat isi detailnya..
				</p>
			</div>
		);
	}

	return (
		<Card className="h-full flex flex-col shadow-none border-0 overflow-hidden">
			<CardHeader className="p-3 border-b shrink-0 bg-card/50 backdrop-blur-sm space-y-1.5">
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className="text-[9px] uppercase font-bold tracking-wider px-1.5 h-4"
					>
						{mail.category.name}
					</Badge>
					<span className="text-[10px] text-muted-foreground font-medium">
						{format(new Date(mail.mailDate), "EEEE, dd MMMM yyyy HH:mm", {
							locale: id,
						})}
					</span>
				</div>
				<CardTitle className="text-lg font-bold leading-tight text-foreground/90">
					{mail.subject}
				</CardTitle>
				<div className="flex items-center gap-2 text-xs">
					<span className="text-muted-foreground text-[11px]">Nomor:</span>
					<code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] font-semibold text-foreground">
						{mail.mailNumber}
					</code>
				</div>
			</CardHeader>

			<div className="flex flex-col flex-1 overflow-auto bg-card/30">
				<CardContent className="p-3 space-y-4 max-w-4xl">
					<div className="flex items-center gap-2.5">
						<div className="size-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-[10px] shadow-inner">
							{mail.audit.createdByName.charAt(0)}
						</div>
						<div className="flex flex-col">
							<span className="text-[9px] uppercase font-bold text-muted-foreground leading-none mb-0.5">
								Pengirim
							</span>
							<p className="text-[11px] font-semibold text-foreground">
								{mail.audit.createdByName}
							</p>
						</div>
					</div>

					<Separator className="bg-border/50" />

					<div className="bg-background/50 rounded-lg p-3 ring-1 ring-border/50 shadow-xs min-h-50">
						<div
							className="prose prose-slate prose-sm max-w-none text-foreground/80 leading-relaxed text-[12px]"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Internal dummy content
							dangerouslySetInnerHTML={{ __html: mail.content }}
						/>
					</div>

					{mail.note && (
						<div className="p-2.5 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg border border-amber-200/50 dark:border-amber-900/30 text-[11px] italic shadow-xs">
							<div className="flex gap-2">
								<span className="font-bold not-italic text-amber-700 dark:text-amber-500">
									Catatan:
								</span>
								<p className="text-amber-800/80 dark:text-amber-200/60 leading-relaxed">
									{mail.note}
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</div>

			<div className="p-2.5 border-t bg-muted/20 shrink-0 flex items-center justify-between">
				<div className="flex items-center gap-4 text-[10px]">
					<div className="flex items-center gap-1.5">
						<span className="font-bold text-muted-foreground uppercase tracking-tighter">
							Sirkulasi
						</span>
						<Badge
							variant="secondary"
							className="h-4 px-1.5 py-0 font-semibold bg-primary/5 text-primary border-primary/10 text-[9px]"
						>
							{mail.circulationName || "Disposisi"}
						</Badge>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground">
						<IconPaperclip className="size-3" />
						<span className="font-medium">
							{mail.summary.attachmentQty} Lampiran
						</span>
					</div>
				</div>
				{mail.maxResponseDate && (
					<div className="flex items-center gap-1.5 px-2 py-0.5 bg-destructive/5 rounded-full border border-destructive/10">
						<span className="text-[9px] uppercase font-bold text-destructive/70">
							Batas Respon
						</span>
						<span className="font-bold text-destructive text-[10px]">
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
