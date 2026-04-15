"use client";

import type { SortingState } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { queryParsers, useQueryStates } from "./use-query-state";

export const DEFAULT_SIZE = 20;

export interface PaginationState {
	page: number;
	setPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	searchValue: string;
	setSearchValue: (search: string) => void;
	sorting: SortingState;
	setSorting: (
		updater: SortingState | ((prev: SortingState) => SortingState),
	) => void;
	sortBy: string;
	sortDir: string;
	searchParams: URLSearchParams;
	setStates: (
		updates: Record<string, string | number | undefined | null>,
	) => void;
}

export function usePagination(): PaginationState {
	const { searchParams, setStates } = useQueryStates();

	const page = useMemo(
		() => queryParsers.number(searchParams.get("page")),
		[searchParams],
	);
	const pageSize = useMemo(
		() => queryParsers.number(searchParams.get("size")) || DEFAULT_SIZE,
		[searchParams],
	);
	const searchValue = useMemo(
		() => queryParsers.string(searchParams.get("search")),
		[searchParams],
	);
	const sortBy = useMemo(
		() => queryParsers.string(searchParams.get("sortBy")),
		[searchParams],
	);
	const sortDir = useMemo(
		() => queryParsers.string(searchParams.get("sortDir")) || "asc",
		[searchParams],
	);

	const sorting = useMemo<SortingState>(
		() => (sortBy ? [{ id: sortBy, desc: sortDir === "desc" }] : []),
		[sortBy, sortDir],
	);

	const setPage = useCallback(
		(p: number) => setStates({ page: p }),
		[setStates],
	);
	const setPageSize = useCallback(
		(s: number) => setStates({ size: s, page: 0 }),
		[setStates],
	);
	const setSearchValue = useCallback(
		(s: string) => setStates({ search: s, page: 0 }),
		[setStates],
	);
	const setSorting = useCallback(
		(updater: SortingState | ((prev: SortingState) => SortingState)) => {
			const next = typeof updater === "function" ? updater(sorting) : updater;
			const item = next[0];
			setStates({
				sortBy: item?.id,
				sortDir: item ? (item.desc ? "desc" : "asc") : undefined,
				page: 0,
			});
		},
		[setStates, sorting],
	);

	return {
		page,
		setPage,
		pageSize,
		setPageSize,
		searchValue,
		setSearchValue,
		sorting,
		setSorting,
		sortBy,
		sortDir,
		searchParams,
		setStates,
	};
}

export { queryParsers };
