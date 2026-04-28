"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react"; // Keep useState for openFolders, remove useEffect, useMemo for data fetching
import { fetchFolderTree } from "@/lib/mail-folder-api"; // Import API function

interface UseMailFolderTreeProps {
	selectedFolderId: string | null;
}

export const useMailFolderTree = ({
	selectedFolderId,
}: UseMailFolderTreeProps) => {
	const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

	// Fetch folder tree data using TanStack Query
	const {
		data: folders, // Rename data to folders for clarity
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["mailFolderTree"],
		queryFn: fetchFolderTree,
	});

	// Update open folders when selection changes
	// This logic depends on `selectedFolderId` and the fetched `folders` data
	useMemo(() => {
		// Using useMemo here for the side effect like update
		if (selectedFolderId && folders) {
			// Ensure folders are fetched
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
	}, [selectedFolderId, folders]); // Dependency array includes fetched folders

	const toggleFolder = useCallback((folderId: string, open: boolean) => {
		setOpenFolders((prev) => ({ ...prev, [folderId]: open }));
	}, []);

	// Filter root folders from fetched data
	const rootFolders = useMemo(
		() => (folders || []).filter((f) => f.parentFolderId === null),
		[folders],
	);

	// Get children for a given folder from fetched data
	const getChildren = useCallback(
		(folderId: string) =>
			(folders || []).filter((f) => f.parentFolderId === folderId),
		[folders],
	);

	const isOpen = useCallback(
		(folderId: string) => !!openFolders[folderId],
		[openFolders],
	);

	return {
		folders: folders || [], // Return fetched folders
		openFolders,
		toggleFolder,
		rootFolders,
		getChildren,
		isOpen,
		isLoading,
		isError,
		error,
	};
};
