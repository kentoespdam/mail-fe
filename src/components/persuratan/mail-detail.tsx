"use client";

import { IconInbox, IconPaperclip } from "@tabler/icons-react";
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
			<div className="flex h-full items-center justify-center p-8 text-center bg-muted/5 rounded-lg border border-dashed m-2">
				<div className="flex flex-col items-center gap-3">
					<div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center ring-1 ring-border shadow-inner">
						<IconInbox className="size-8 text-muted-foreground/40" />
					</div>
					<div className="space-y-1">
						<h3 className="font-semibold text-foreground">Pilih Surat</h3>
						<p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
							Silahkan pilih salah satu surat dari daftar untuk melihat detail
							konten dan lampiran.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Card className="h-full flex flex-col shadow-none border-0 bg-transparent overflow-hidden">
			<CardHeader className="p-6 border-b shrink-0 bg-card/50 backdrop-blur-sm">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-3 flex-1">
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								className="text-[10px] uppercase font-bold tracking-wider px-2"
							>
								{mail.category.name}
							</Badge>
							<div className="h-1 w-1 rounded-full bg-border" />
							<span className="text-xs text-muted-foreground font-medium">
								{format(new Date(mail.mailDate), "EEEE, dd MMMM yyyy HH:mm", {
									locale: id,
								})}
							</span>
						</div>
						<CardTitle className="text-2xl font-extrabold leading-tight tracking-tight text-foreground/90">
							{mail.subject}
						</CardTitle>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">Nomor:</span>
							<code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs font-semibold text-foreground">
								{mail.mailNumber}
							</code>
						</div>
					</div>
				</div>
			</CardHeader>

			<div className="flex flex-col flex-1 overflow-auto bg-card/30">
				<CardContent className="p-6 space-y-8 max-w-4xl">
					<div className="flex items-center gap-4">
						<div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shadow-inner">
							{mail.audit.createdByName.charAt(0)}
						</div>
						<div className="flex flex-col">
							<span className="text-[10px] uppercase font-bold text-muted-foreground leading-none mb-1">
								Pengirim
							</span>
							<p className="text-sm font-semibold text-foreground">
								{mail.audit.createdByName}
							</p>
						</div>
					</div>

					<Separator className="bg-border/50" />

					<div className="bg-background/50 rounded-xl p-6 ring-1 ring-border/50 shadow-xs min-h-[300px]">
						<div
							className="prose prose-slate prose-sm max-w-none text-foreground/80 leading-relaxed"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Internal dummy content
							dangerouslySetInnerHTML={{ __html: mail.content }}
						/>
					</div>

					{mail.note && (
						<div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 rounded-xl border border-amber-200/50 dark:border-amber-900/30 text-sm italic shadow-xs">
							<div className="flex gap-3">
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

			<div className="p-4 border-t bg-muted/20 shrink-0 flex items-center justify-between">
				<div className="flex items-center gap-6 text-xs">
					<div className="flex items-center gap-2">
						<span className="font-bold text-muted-foreground uppercase tracking-tighter">
							Sirkulasi
						</span>
						<Badge
							variant="secondary"
							className="h-5 px-2 py-0 font-semibold bg-primary/5 text-primary border-primary/10"
						>
							{mail.circulationName || "Disposisi"}
						</Badge>
					</div>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<IconPaperclip className="size-3.5" />
						<span className="font-medium">
							{mail.summary.attachmentQty} Lampiran
						</span>
					</div>
				</div>
				{mail.maxResponseDate && (
					<div className="flex items-center gap-2 px-3 py-1 bg-destructive/5 rounded-full border border-destructive/10">
						<span className="text-[10px] uppercase font-bold text-destructive/70">
							Batas Respon
						</span>
						<span className="font-bold text-destructive text-xs">
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
