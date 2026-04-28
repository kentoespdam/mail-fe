"use client";

import { useState } from "react";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	useSidebar,
} from "@/components/ui/sidebar";
import { useMailFolderTree } from "@/hooks/persuratan/use-mail-folder-tree";
import { MailFolderItem } from "./mail-folder-item";

interface MailFolderTreeProps {
	selectedFolderId: string | null;
	onSelectFolder: (folderId: string) => void;
}
export const MailFolderTree = ({
	selectedFolderId,
	onSelectFolder,
}: MailFolderTreeProps) => {
	const { state, isMobile, setOpenMobile } = useSidebar();
	const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
	const isCollapsedMode = state === "collapsed" && !isMobile;

	const { rootFolders, getChildren, isOpen, toggleFolder } = useMailFolderTree({
		selectedFolderId,
	});

	const handleSelectFolder = (folderId: string) => {
		onSelectFolder(folderId);
		if (isMobile) setOpenMobile(false);
	};

	return (
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Folder</SidebarGroupLabel>
				<SidebarMenu>
					{rootFolders.map((folder) => (
						<MailFolderItem
							key={folder.id}
							folder={folder}
							selectedFolderId={selectedFolderId}
							onSelectFolder={handleSelectFolder}
							getChildren={getChildren}
							isOpen={isOpen}
							toggleFolder={toggleFolder}
							isCollapsedMode={isCollapsedMode}
							openPopoverId={openPopoverId}
							setOpenPopoverId={setOpenPopoverId}
						/>
					))}
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
	);
};
