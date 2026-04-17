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
import { useState } from "react";
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
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useMailFolderTree } from "@/hooks/persuratan/use-mail-folder-tree";
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
	const { state, isMobile, setOpenMobile } = useSidebar();
	const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
	const isCollapsedMode = state === "collapsed" && !isMobile;

	const { rootFolders, getChildren, isOpen, toggleFolder } = useMailFolderTree({
		folders,
		selectedFolderId,
	});

	const handleSelectFolder = (folderId: string) => {
		onSelectFolder(folderId);
		if (isMobile) setOpenMobile(false);
	};

	const renderFolder = (folder: MailFolderDto, level = 0) => {
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
								{getIcon(folder.id, folder.iconCls)}
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
												handleSelectFolder(child.id);
												setOpenPopoverId(null);
											}}
										>
											{getIcon(child.id, child.iconCls)}
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
										{getIcon(folder.id, folder.iconCls)}
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
									// onClick={() => handleSelectFolder(folder.id)}
									tooltip={folder.name}
									className={cn(folder.unread > 0 && "pr-10")}
								>
									{getIcon(folder.id, folder.iconCls)}
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
							{children.map((child) => renderFolder(child, level + 1))}
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
						onClick={() => handleSelectFolder(folder.id)}
					>
						<div className="flex flex-1 items-center gap-2 truncate">
							{getIcon(folder.id, folder.iconCls)}
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
					onClick={() => handleSelectFolder(folder.id)}
					tooltip={folder.name}
				>
					{getIcon(folder.id, folder.iconCls)}
					<span>{folder.name}</span>
				</SidebarMenuButton>
				{folder.unread > 0 && (
					<SidebarMenuBadge>{folder.unread}</SidebarMenuBadge>
				)}
			</SidebarMenuItem>
		);
	};

	return (
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Folder</SidebarGroupLabel>
				<SidebarMenu>
					{rootFolders.map((folder) => renderFolder(folder))}
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
	);
};
