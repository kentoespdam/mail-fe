"use client";

import { useQuery } from "@tanstack/react-query";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import {
	queryParsers,
	querySerializers,
	useQueryState,
} from "@/hooks/use-query-state"; // Assuming this hook exists and is imported like this
import { fetchMailsInFolder } from "@/lib/mail-api";

export const useMailListState = (selectedFolderId: string) => {
	// State management using useQueryState for URL synchronization
	const [keyword, setKeyword] = useQueryState<string>("keyword", "", {
		parse: queryParsers.string,
		serialize: querySerializers.string,
	});
	const [page, setPage] = useQueryState<number>("page", 0, {
		parse: queryParsers.number,
		serialize: querySerializers.number,
	});
	const [pageSize, setPageSize] = useQueryState<number>("size", 10, {
		parse: queryParsers.number,
		serialize: querySerializers.number,
	});
	const [sortBy, setSortBy] = useQueryState<string>("sortBy", "", {
		parse: queryParsers.string,
		serialize: querySerializers.string,
	});
	const [sortDir, setSortDir] = useQueryState<string>("sortDir", "asc", {
		parse: queryParsers.string,
		serialize: querySerializers.string,
	});

	// Map sorting state to query parameters
	const sorting = useMemo(() => {
		if (sortBy) {
			return [{ id: sortBy, desc: sortDir === "desc" }];
		}
		return [];
	}, [sortBy, sortDir]);

	// Fetch mail data using TanStack Query
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: [
			"mailList",
			selectedFolderId,
			keyword,
			page,
			pageSize,
			sortBy,
			sortDir,
		],
		queryFn: () =>
			fetchMailsInFolder(selectedFolderId, {
				keyword,
				page,
				size: pageSize,
				sortBy,
				sortDir,
			}),
		enabled: !!selectedFolderId, // Only fetch when selectedFolderId is available
	});

	// Event handlers to update state and trigger refetch/reset
	const handleSearch = useCallback(
		(newKeyword: string) => {
			setKeyword(newKeyword);
			setPage(0); // Reset to first page on new search
		},
		[setKeyword, setPage],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			setPage(newPage);
		},
		[setPage],
	);

	const handlePageSizeChange = useCallback(
		(newSize: number) => {
			setPageSize(newSize);
			setPage(0); // Reset to first page when page size changes
		},
		[setPageSize, setPage],
	);

	const handleSortingChange: OnChangeFn<SortingState> = useCallback(
		(updaterOrValue) => {
			// TanStack Table's SortingState is an array of objects, e.g., [{ id: 'mailDate', desc: true }]
			// We need to convert this to sortBy and sortDir strings for the API
			const newSorting = Array.isArray(updaterOrValue)
				? updaterOrValue
				: updaterOrValue(sorting); // Apply updater function if provided

			if (newSorting.length > 0) {
				setSortBy(newSorting[0].id);
				setSortDir(newSorting[0].desc ? "desc" : "asc");
			} else {
				setSortBy("");
				setSortDir("asc");
			}
			setPage(0); // Reset to first page on sort change
		},
		[sorting, setSortBy, setSortDir, setPage],
	);

	// Return values for the component to use
	return {
		keyword,
		page,
		pageSize,
		sorting, // This is the client-side representation for the table
		data: data?.content || [], // Actual mail list
		totalPages: data?.page.totalPages || 0,
		totalElements: data?.page.totalElements || 0,
		isLoading,
		isError,
		error,
		handleSearch,
		handlePageChange,
		handlePageSizeChange,
		handleSortingChange,
		refetch, // Expose refetch if needed by parent components
	};
};
