"use client";

import {
	IconArchive,
	IconChevronDown,
	IconChevronRight,
	IconFileDescription,
	IconFolder,
	IconInbox,
	IconMailOpened,
	IconSend,
	IconStar,
	IconTrash,
} from "@tabler/icons-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { MailFolderDto } from "@/types/mail";

export const getFolderIcon = (id: string) => {
	const baseClass = "size-4 transition-colors duration-200";
	switch (id) {
		case "inbox":
			return <IconInbox className={cn(baseClass, "text-primary")} />;
		case "draft":
			return (
				<IconFileDescription className={cn(baseClass, "text-primary/70")} />
			);
		case "read-items":
			return <IconMailOpened className={cn(baseClass, "text-primary/60")} />;
		case "sent-items":
			return <IconSend className={cn(baseClass, "text-primary/70")} />;
		case "deleted-items":
			return <IconTrash className={cn(baseClass, "text-destructive/70")} />;
		case "penting":
			return (
				<IconStar className={cn(baseClass, "text-amber-500 fill-amber-500")} />
			);
		case "archive":
			return <IconArchive className={cn(baseClass, "text-primary/70")} />;
		default:
			return (
				<IconFolder className={cn(baseClass, "text-muted-foreground/60")} />
			);
	}
};

interface MailFolderItemProps {
	folder: MailFolderDto;
	level?: number;
	selectedFolderId: string | null;
	onSelectFolder: (folderId: string) => void;
	getChildren: (folderId: string) => MailFolderDto[];
	isOpen: (folderId: string) => boolean;
	toggleFolder: (folderId: string, open: boolean) => void;
	isCollapsedMode: boolean;
	openPopoverId: string | null;
	setOpenPopoverId: (id: string | null) => void;
}

export const MailFolderItem = ({
	folder,
	level = 0,
	selectedFolderId,
	onSelectFolder,
	getChildren,
	isOpen,
	toggleFolder,
	isCollapsedMode,
	openPopoverId,
	setOpenPopoverId,
}: MailFolderItemProps) => {
	const children = getChildren(folder.id);
	const isSelected = selectedFolderId === folder.id;
	const hasChildren = children.length > 0;
	const open = isOpen(folder.id);

	if (hasChildren) {
		if (isCollapsedMode && level === 0) {
			return (
				<SidebarMenuItem key={folder.id}>
					<Popover
						open={openPopoverId === folder.id}
						onOpenChange={(o) => setOpenPopoverId(o ? folder.id : null)}
					>
						<PopoverTrigger
							render={
								<SidebarMenuButton
									isActive={isSelected}
									tooltip={folder.name}
									className={cn(folder.unread > 0 && "pr-10")}
								/>
							}
						>
							{getFolderIcon(folder.id)}
							<span>{folder.name}</span>
							{folder.unread > 0 && (
								<SidebarMenuBadge>{folder.unread}</SidebarMenuBadge>
							)}
						</PopoverTrigger>
						<PopoverContent
							side="right"
							align="start"
							sideOffset={8}
							className="w-48 p-1 bg-sidebar text-sidebar-foreground border-sidebar-border shadow-md"
						>
							<div className="flex flex-col gap-0.5">
								<div className="px-2 py-1.5 text-[11px] font-semibold text-sidebar-foreground/70 border-b border-sidebar-border mb-1">
									{folder.name}
								</div>
								{children.map((child) => (
									<button
										key={child.id}
										type="button"
										className={cn(
											"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
											selectedFolderId === child.id &&
												"bg-sidebar-accent font-medium text-sidebar-accent-foreground",
										)}
										onClick={() => {
											onSelectFolder(child.id);
											setOpenPopoverId(null);
										}}
									>
										{getFolderIcon(child.id)}
										<span className="truncate">{child.name}</span>
										{child.unread > 0 && (
											<span className="ml-auto text-[10px] font-bold tabular-nums">
												{child.unread}
											</span>
										)}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</SidebarMenuItem>
			);
		}

		return (
			<Collapsible
				key={folder.id}
				open={open}
				onOpenChange={(open) => toggleFolder(folder.id, open)}
				className="group/collapsible"
				render={level > 0 ? <SidebarMenuSubItem /> : <SidebarMenuItem />}
			>
				<CollapsibleTrigger
					render={
						level > 0 ? (
							<SidebarMenuSubButton isActive={isSelected}>
								<div className="flex flex-1 items-center gap-2 truncate">
									{getFolderIcon(folder.id)}
									<span className="truncate">{folder.name}</span>
								</div>
								{(folder.unread > 0 || hasChildren) && (
									<div className="ml-auto flex items-center gap-1.5">
										{folder.unread > 0 && (
											<span className="text-[10px] font-bold">
												{folder.unread}
											</span>
										)}
										{open ? (
											<IconChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										) : (
											<IconChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										)}
									</div>
								)}
							</SidebarMenuSubButton>
						) : (
							<SidebarMenuButton
								isActive={isSelected}
								tooltip={folder.name}
								className={cn(folder.unread > 0 && "pr-10")}
							>
								{getFolderIcon(folder.id)}
								<span>{folder.name}</span>
								{open ? (
									<IconChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								) : (
									<IconChevronRight className="size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								)}
							</SidebarMenuButton>
						)
					}
				/>
				{folder.unread > 0 && level === 0 && (
					<SidebarMenuBadge>{folder.unread}</SidebarMenuBadge>
				)}
				<CollapsibleContent>
					<SidebarMenuSub className="ml-3.5 mr-0 pr-0">
						{children.map((child) => (
							<MailFolderItem
								key={child.id}
								folder={child}
								level={level + 1}
								selectedFolderId={selectedFolderId}
								onSelectFolder={onSelectFolder}
								getChildren={getChildren}
								isOpen={isOpen}
								toggleFolder={toggleFolder}
								isCollapsedMode={isCollapsedMode}
								openPopoverId={openPopoverId}
								setOpenPopoverId={setOpenPopoverId}
							/>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		);
	}

	if (level > 0) {
		return (
			<SidebarMenuSubItem key={folder.id}>
				<SidebarMenuSubButton
					isActive={isSelected}
					onClick={() => onSelectFolder(folder.id)}
				>
					<div className="flex flex-1 items-center gap-2 truncate">
						{getFolderIcon(folder.id)}
						<span className="truncate">{folder.name}</span>
					</div>
					{folder.unread > 0 && (
						<span className="ml-auto text-[10px] font-bold tabular-nums">
							{folder.unread}
						</span>
					)}
				</SidebarMenuSubButton>
			</SidebarMenuSubItem>
		);
	}

	return (
		<SidebarMenuItem key={folder.id}>
			<SidebarMenuButton
				isActive={isSelected}
				onClick={() => onSelectFolder(folder.id)}
				tooltip={folder.name}
			>
				{getFolderIcon(folder.id)}
				<span>{folder.name}</span>
			</SidebarMenuButton>
			{folder.unread > 0 && (
				<SidebarMenuBadge>{folder.unread}</SidebarMenuBadge>
			)}
		</SidebarMenuItem>
	);
};
