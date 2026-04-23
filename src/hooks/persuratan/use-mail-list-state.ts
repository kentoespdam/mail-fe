"use client";

import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DUMMY_MAILS } from "@/lib/dummy/mail-dummy";

export const useMailListState = (selectedFolderId: string) => {
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [sorting, setSorting] = useState<SortingState>([]);

	// Reset page when folder changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: folder change triggers reset
	useEffect(() => {
		setPage(0);
	}, [selectedFolderId]);

	const handleSearch = useCallback((newKeyword: string) => {
		setKeyword(newKeyword);
		setPage(0);
	}, []);

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handlePageSizeChange = useCallback((newSize: number) => {
		setPageSize(newSize);
		setPage(0);
	}, []);

	const handleSortingChange: OnChangeFn<SortingState> = useCallback(
		(updaterOrValue) => {
			setSorting(updaterOrValue);
		},
		[],
	);

	const filteredMails = useMemo(() => {
		return DUMMY_MAILS.filter((mail) => {
			const matchesFolder = mail.folderId === selectedFolderId;
			const matchesKeyword =
				mail.subject.toLowerCase().includes(keyword.toLowerCase()) ||
				mail.mailNumber.toLowerCase().includes(keyword.toLowerCase());
			return matchesFolder && matchesKeyword;
		});
	}, [selectedFolderId, keyword]);

	return {
		keyword,
		page,
		pageSize,
		sorting,
		handleSearch,
		handlePageChange,
		handlePageSizeChange,
		handleSortingChange,
		filteredMails,
	};
};
