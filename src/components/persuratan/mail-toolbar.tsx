"use client";

import {
	IconArrowBack,
	IconArrowBackUp,
	IconDots,
	IconEdit,
	IconPlus,
	IconSearch,
	IconTrash,
} from "@tabler/icons-react";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipButton } from "@/components/ui/tooltip-button";

interface MailToolbarProps {
	onSearch: (keyword: string) => void;
	onDateFilter: (start: string, end: string) => void;
	selectedMailId: string | null;
	selectedFolderId: string;
	mailStatus?: string;
}

export const MailToolbar = memo(
	({
		onSearch,
		selectedMailId,
		selectedFolderId,
		mailStatus,
	}: MailToolbarProps) => {
		const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

		const handleAction = useCallback((action: string) => {
			toast.info(`Fitur ${action} dalam pengembangan`);
		}, []);

		const handleDelete = useCallback(() => {
			toast.success("Surat berhasil dihapus");
			setDeleteDialogOpen(false);
		}, []);

		const isDraftOrRevisi = mailStatus === "DRAFT" || mailStatus === "REVISI";
		const isDeletedItems = selectedFolderId === "deleted-items";

		return (
			<div className="flex flex-col gap-2 p-2 px-3 border-b bg-card">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-1.5">
						<TooltipButton
							size="sm"
							variant="default"
							className="h-8 text-xs px-2"
							tooltip="Tulis Surat Baru"
							onClick={() => handleAction("Tulis Baru")}
						>
							<IconPlus className="size-3.5 mr-1" />
							Tulis Baru
						</TooltipButton>

						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button
										variant="outline"
										size="sm"
										className="h-8 text-xs px-2"
										disabled={!selectedMailId}
									>
										<IconDots className="size-3.5 mr-1" />
										Tindakan
									</Button>
								}
							/>
							<DropdownMenuContent align="start">
								<DropdownMenuItem onClick={() => handleAction("Disposisi")}>
									Disposisi
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleAction("Teruskan")}>
									Teruskan
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleAction("Pindah Folder")}>
									Pindah Folder
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{isDraftOrRevisi && (
							<Button
								variant="outline"
								size="sm"
								className="h-8 text-xs px-2"
								onClick={() => handleAction("Edit")}
							>
								<IconEdit className="size-3.5 mr-1" />
								Edit
							</Button>
						)}
					</div>

					<div className="flex items-center gap-1.5">
						<Button
							variant="outline"
							size="sm"
							className="h-8 text-xs px-2 text-destructive hover:text-destructive"
							disabled={!selectedMailId}
							onClick={() => setDeleteDialogOpen(true)}
						>
							<IconTrash className="size-3.5 mr-1" />
							Hapus
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-8 text-xs px-2"
							disabled={!selectedMailId}
							onClick={() => handleAction("Respon")}
						>
							<IconArrowBackUp className="size-3.5 mr-1" />
							Respon
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-8 text-xs px-2"
							disabled={!isDeletedItems || !selectedMailId}
							onClick={() => handleAction("Kembalikan")}
						>
							<IconArrowBack className="size-3.5 mr-1" />
							Kembalikan
						</Button>
					</div>
				</div>

				<div className="flex flex-wrap items-end gap-3 pt-1">
					<div className="grid gap-1">
						<Label
							htmlFor="startDate"
							className="text-[9px] uppercase font-bold text-muted-foreground/80"
						>
							Surat Dari Tanggal
						</Label>
						<div className="flex items-center gap-1.5">
							<Input
								id="startDate"
								type="date"
								className="h-7 w-32 text-[11px] px-2"
								onChange={(e) => console.log(e.target.value)}
							/>
							<span className="text-[10px] text-muted-foreground">s.d</span>
							<Input
								id="endDate"
								type="date"
								className="h-7 w-32 text-[11px] px-2"
								onChange={(e) => console.log(e.target.value)}
							/>
						</div>
					</div>

					<div className="grid gap-1 flex-1 max-w-sm">
						<Label
							htmlFor="keyword"
							className="text-[9px] uppercase font-bold text-muted-foreground/80"
						>
							Kata Kunci
						</Label>
						<div className="flex items-center gap-1.5">
							<Input
								id="keyword"
								placeholder="Cari perihal, nomor surat..."
								className="h-7 text-[11px]"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										onSearch((e.target as HTMLInputElement).value);
									}
								}}
							/>
							<Button
								size="sm"
								className="h-7 text-xs px-2"
								onClick={() => onSearch("")}
							>
								<IconSearch className="size-3.5 mr-1" />
								Cari
							</Button>
						</div>
					</div>
				</div>

				<DeleteConfirmDialog
					open={deleteDialogOpen}
					onClose={() => setDeleteDialogOpen(false)}
					onConfirm={handleDelete}
					title="Hapus Surat"
					description="Apakah Anda yakin ingin menghapus surat ini? Surat akan dipindahkan ke folder Deleted Items."
				/>
			</div>
		);
	},
);

MailToolbar.displayName = "MailToolbar";
