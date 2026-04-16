"use client";

import {
	IconArchive,
	IconFileDescription,
	IconFolder,
	IconInbox,
	IconMailOpened,
	IconSend,
	IconStar,
	IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MailFolderDto } from "@/types/mail";

interface MailFolderTreeProps {
	folders: MailFolderDto[];
	selectedFolderId: string | null;
	onSelectFolder: (folderId: string) => void;
}

const getIcon = (id: string, _iconCls: string) => {
	switch (id) {
		case "inbox":
			return <IconInbox className="size-4 text-blue-500" />;
		case "draft":
			return <IconFileDescription className="size-4 text-amber-500" />;
		case "read-items":
			return <IconMailOpened className="size-4 text-emerald-500" />;
		case "sent-items":
			return <IconSend className="size-4 text-sky-500" />;
		case "deleted-items":
			return <IconTrash className="size-4 text-rose-500" />;
		case "penting":
			return <IconStar className="size-4 text-yellow-500 fill-yellow-500" />;
		case "archive":
			return <IconArchive className="size-4 text-purple-500" />;
		default:
			return <IconFolder className="size-4 text-slate-400" />;
	}
};

export const MailFolderTree = ({
	folders,
	selectedFolderId,
	onSelectFolder,
}: MailFolderTreeProps) => {
	const renderFolder = (folder: MailFolderDto, level = 0) => {
		const children = folders.filter((f) => f.parentFolderId === folder.id);
		const isSelected = selectedFolderId === folder.id;

		return (
			<div key={folder.id} className="flex flex-col">
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"group justify-between px-2 h-8 font-normal hover:bg-muted/80 transition-all",
						isSelected &&
							"bg-accent text-accent-foreground font-semibold shadow-sm",
						level > 0 && "ml-4",
					)}
					onClick={() => onSelectFolder(folder.id)}
				>
					<div className="flex items-center gap-2 truncate">
						{getIcon(folder.id, folder.iconCls)}
						<span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
							{folder.name}
						</span>
					</div>
					{folder.unread > 0 && (
						<Badge
							variant="secondary"
							className={cn(
								"h-4 min-w-4 px-1 justify-center text-[9px] font-bold",
								isSelected ? "bg-background" : "bg-primary/10 text-primary",
							)}
						>
							{folder.unread}
						</Badge>
					)}
				</Button>
				{children.length > 0 && (
					<div className="flex flex-col mt-0.5">
						{children.map((child) => renderFolder(child, level + 1))}
					</div>
				)}
			</div>
		);
	};

	const rootFolders = folders.filter((f) => f.parentFolderId === null);

	return (
		<div className="h-full overflow-auto">
			<div className="flex flex-col gap-1 p-2">
				{rootFolders.map((folder) => renderFolder(folder))}
			</div>
		</div>
	);
};
