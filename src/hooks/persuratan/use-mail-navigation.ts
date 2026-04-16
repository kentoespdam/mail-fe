"use client";

import { useCallback, useState } from "react";

export const useMailNavigation = () => {
	const [selectedFolderId, setSelectedFolderId] = useState<string>("inbox");
	const [selectedMailId, setSelectedMailId] = useState<string | null>(null);

	const selectFolder = useCallback((folderId: string) => {
		setSelectedFolderId(folderId);
		setSelectedMailId(null);
	}, []);

	const selectMail = useCallback((mailId: string) => {
		setSelectedMailId(mailId);
	}, []);

	return {
		selectedFolderId,
		selectedMailId,
		selectFolder,
		selectMail,
	};
};
