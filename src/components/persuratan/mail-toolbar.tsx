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
import { memo } from "react";
import { DeleteConfirmDialog } from "@/components/builder/delete-confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { useMailToolbar } from "@/hooks/persuratan/use-mail-toolbar";
import { cn } from "@/lib/utils";

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
		onDateFilter,
		selectedMailId,
		selectedFolderId,
		mailStatus,
	}: MailToolbarProps) => {
		const {
			deleteDialogOpen,
			setDeleteDialogOpen,
			handleAction,
			handleDelete,
			handleSearch,
			handleClearSearch,
			handleDateChange,
			searchKeyword,
			setSearchKeyword,
			startDate,
			endDate,
			isDraftOrRevisi,
			isDeletedItems,
		} = useMailToolbar({
			selectedFolderId,
			mailStatus,
			onSearch,
			onDateFilter,
		});

		return (
			<div className="flex flex-col gap-1.5 p-1.5 border-b bg-card">
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-1 h-4" />
						<TooltipButton
							size="sm"
							variant="default"
							className="h-7 text-[11px] px-2"
							tooltip="Tulis Surat Baru"
							onClick={() => handleAction("Tulis Baru")}
						>
							<IconPlus className="size-3 mr-1" />
							Tulis Baru
						</TooltipButton>

						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								<span className="text-[10px] text-muted-foreground whitespace-nowrap">
									Surat Dari:
								</span>
								<Input
									type="date"
									className="h-7 w-28.75 text-[10px] px-1.5 py-0"
									value={startDate}
									onChange={(e) => handleDateChange("start", e.target.value)}
								/>
								<span className="text-[10px] text-muted-foreground">s.d</span>
								<Input
									type="date"
									className="h-7 w-28.75 text-[10px] px-1.5 py-0"
									value={endDate}
									onChange={(e) => handleDateChange("end", e.target.value)}
								/>
							</div>

							<div className="flex items-center gap-1">
								<span className="text-[10px] text-muted-foreground whitespace-nowrap">
									Kata Kunci:
								</span>
								<div className="flex items-center gap-1">
									<Input
										placeholder="Cari..."
										className="h-7 w-32 text-[10px] px-2"
										value={searchKeyword}
										onChange={(e) => setSearchKeyword(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleSearch();
											}
										}}
									/>
									<Button
										size="sm"
										className="h-7 text-[11px] px-2"
										onClick={() => handleClearSearch()}
									>
										<IconSearch className="size-3 mr-1" />
										Cari
									</Button>
								</div>
							</div>
						</div>

						{selectedMailId && (
							<>
								<DropdownMenu>
									<DropdownMenuTrigger
										className={cn(
											buttonVariants({ variant: "outline", size: "sm" }),
											"h-7 text-[11px] px-2",
										)}
										disabled={!selectedMailId}
									>
										<IconDots className="size-3 mr-1" />
										Tindakan
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										<DropdownMenuItem onClick={() => handleAction("Disposisi")}>
											Disposisi
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleAction("Teruskan")}>
											Teruskan
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleAction("Pindah Folder")}
										>
											Pindah Folder
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<Button
									variant="outline"
									size="sm"
									className="h-7 text-[11px] px-2 text-destructive hover:text-destructive"
									disabled={!selectedMailId}
									onClick={() => setDeleteDialogOpen(true)}
								>
									<IconTrash className="size-3 mr-1" />
									Hapus
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="h-7 text-[11px] px-2"
									disabled={!selectedMailId}
									onClick={() => handleAction("Respon")}
								>
									<IconArrowBackUp className="size-3 mr-1" />
									Respon
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="h-7 text-[11px] px-2"
									disabled={!isDeletedItems || !selectedMailId}
									onClick={() => handleAction("Kembalikan")}
								>
									<IconArrowBack className="size-3 mr-1" />
									Kembalikan
								</Button>
							</>
						)}

						{isDraftOrRevisi && (
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-[11px] px-2"
								onClick={() => handleAction("Edit")}
							>
								<IconEdit className="size-3 mr-1" />
								Edit
							</Button>
						)}
					</div>

					<div className="h-4 w-px bg-border mx-1 hidden sm:block" />
				</div>

				<div className="flex items-center gap-1"></div>

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
