"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface UseMailToolbarProps {
	selectedFolderId: string;
	mailStatus?: string;
	onSearch: (keyword: string) => void;
	onDateFilter: (start: string, end: string) => void;
}

export const useMailToolbar = ({
	selectedFolderId,
	mailStatus,
	onSearch,
	onDateFilter,
}: UseMailToolbarProps) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");

	const handleAction = useCallback((action: string) => {
		toast.info(`Fitur ${action} dalam pengembangan`);
	}, []);

	const handleDelete = useCallback(() => {
		toast.success("Surat berhasil dihapus");
		setDeleteDialogOpen(false);
	}, []);

	const handleSearch = useCallback(() => {
		onSearch(searchKeyword);
	}, [onSearch, searchKeyword]);

	const handleClearSearch = useCallback(() => {
		setSearchKeyword("");
		onSearch("");
	}, [onSearch]);

	const handleDateChange = useCallback(
		(type: "start" | "end", value: string) => {
			if (type === "start") {
				setStartDate(value);
				onDateFilter(value, endDate);
			} else {
				setEndDate(value);
				onDateFilter(startDate, value);
			}
		},
		[onDateFilter, startDate, endDate],
	);

	const isDraftOrRevisi = useMemo(
		() => mailStatus === "DRAFT" || mailStatus === "REVISI",
		[mailStatus],
	);

	const isDeletedItems = useMemo(
		() => selectedFolderId === "deleted-items",
		[selectedFolderId],
	);

	return {
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
	};
};
