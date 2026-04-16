"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MailFolderDto } from "@/types/mail";

interface UseMailFolderTreeProps {
	folders: MailFolderDto[];
	selectedFolderId: string | null;
}

export const useMailFolderTree = ({
	folders,
	selectedFolderId,
}: UseMailFolderTreeProps) => {
	const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

	// Update open folders when selection changes
	useEffect(() => {
		if (selectedFolderId) {
			let currentFolder = folders.find((f) => f.id === selectedFolderId);
			const parentIds: string[] = [];

			while (currentFolder?.parentFolderId) {
				parentIds.push(currentFolder.parentFolderId);
				currentFolder = folders.find(
					(f) => f.id === currentFolder?.parentFolderId,
				);
			}

			if (parentIds.length > 0) {
				setOpenFolders((prev) => {
					const next = { ...prev };
					let changed = false;
					for (const id of parentIds) {
						if (!next[id]) {
							next[id] = true;
							changed = true;
						}
					}
					return changed ? next : prev;
				});
			}
		}
	}, [selectedFolderId, folders]);

	const toggleFolder = useCallback((folderId: string, open: boolean) => {
		setOpenFolders((prev) => ({ ...prev, [folderId]: open }));
	}, []);

	const rootFolders = useMemo(
		() => folders.filter((f) => f.parentFolderId === null),
		[folders],
	);

	const getChildren = useCallback(
		(folderId: string) => folders.filter((f) => f.parentFolderId === folderId),
		[folders],
	);

	const isOpen = useCallback(
		(folderId: string) => !!openFolders[folderId],
		[openFolders],
	);

	return {
		openFolders,
		toggleFolder,
		rootFolders,
		getChildren,
		isOpen,
	};
};
