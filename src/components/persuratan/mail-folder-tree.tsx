"use client";

import {
	IconFileDescription,
	IconFolder,
	IconInbox,
	IconMailOpened,
	IconSend,
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

const getIcon = (iconCls: string) => {
	switch (iconCls) {
		case "icon-inbox":
			return <IconInbox className="size-4" />;
		case "icon-draft":
			return <IconFileDescription className="size-4" />;
		case "icon-read":
			return <IconMailOpened className="size-4" />;
		case "icon-sent":
			return <IconSend className="size-4" />;
		case "icon-delete":
			return <IconTrash className="size-4" />;
		default:
			return <IconFolder className="size-4" />;
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
						"justify-between px-2 h-8 font-normal",
						isSelected && "bg-accent text-accent-foreground font-medium",
						level > 0 && "ml-4",
					)}
					onClick={() => onSelectFolder(folder.id)}
				>
					<div className="flex items-center gap-2 truncate">
						{getIcon(folder.iconCls)}
						<span className="truncate">{folder.name}</span>
					</div>
					{folder.unread > 0 && (
						<Badge
							variant="secondary"
							className="h-5 min-w-5 px-1 justify-center text-[10px]"
						>
							{folder.unread}
						</Badge>
					)}
				</Button>
				{children.length > 0 && (
					<div className="flex flex-col">
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
