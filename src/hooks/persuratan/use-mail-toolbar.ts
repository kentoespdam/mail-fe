"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { deleteMail } from "@/lib/mail-api"; // Import API function for deletion

interface UseMailToolbarProps {
	selectedFolderId: string;
	selectedMailIds: string[]; // Added to identify mails for action
	mailStatus?: string;
	onSearch: (keyword: string) => void;
	onDateFilter: (start: string, end: string) => void;
	refetchMailList: () => void; // Callback to refetch the mail list after mutation
}

export const useMailToolbar = ({
	selectedFolderId,
	selectedMailIds,
	mailStatus,
	onSearch,
	onDateFilter,
	refetchMailList, // Use the refetch callback
}: UseMailToolbarProps) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");

	// Mutation for deleting mails
	const deleteMutation = useMutation({
		mutationFn: (ids: string[]) => {
			// Assuming deleteMail handles multiple IDs or we iterate
			// For simplicity, let's assume deleteMail takes an array or we loop
			return Promise.all(ids.map((id) => deleteMail(id)));
		},
		onSuccess: () => {
			refetchMailList(); // Invalidate mail list query
			// Optionally provide user feedback here, e.g., via a state manager or a returned status
			console.log("Mail(s) deleted successfully"); // Replace with better UI feedback
			setDeleteDialogOpen(false); // Close dialog on success
		},
		onError: (error) => {
			console.error("Failed to delete mail(s):", error);
			// Handle error feedback to the user
		},
	});

	const handleAction = useCallback((action: string) => {
		// Placeholder for other actions (move, archive, etc.)
		console.log(`Action ${action} not yet implemented.`);
	}, []);

	const handleDeleteClick = useCallback(() => {
		// Action to open the confirmation dialog
		if (selectedMailIds.length > 0) {
			setDeleteDialogOpen(true);
		} else {
			console.log("No mail selected for deletion.");
		}
	}, [selectedMailIds]);

	const handleDeleteConfirm = useCallback(() => {
		// Action to perform deletion after confirmation
		if (selectedMailIds.length > 0) {
			deleteMutation.mutate(selectedMailIds);
		}
	}, [deleteMutation, selectedMailIds]);

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
		handleDeleteConfirm, // Renamed for clarity on confirmation action
		handleDeleteClick, // New handler to open dialog
		handleSearch,
		handleClearSearch,
		handleDateChange,
		searchKeyword,
		setSearchKeyword,
		startDate,
		endDate,
		isDraftOrRevisi,
		isDeletedItems,
		isDeleting: deleteMutation.isPending, // Expose mutation state
	};
};
