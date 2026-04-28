"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchThread, fetchTracking } from "@/lib/mail-api"; // Import API functions

export const useMailDetailState = (selectedMailId: string | null) => {
	// Fetch mail thread data
	const {
		data: threadData,
		isLoading: isLoadingThread,
		isError: isErrorThread,
		error: errorThread,
	} = useQuery({
		queryKey: ["mailDetail", selectedMailId],
		queryFn: () => {
			if (!selectedMailId) return [];
			return fetchThread(selectedMailId);
		},
		enabled: !!selectedMailId, // Only query if an ID is selected
	});

	// Fetch mail tracking data
	const {
		data: trackingData,
		isLoading: isLoadingTracking,
		isError: isErrorTracking,
		error: errorTracking,
	} = useQuery({
		queryKey: ["mailTracking", selectedMailId],
		queryFn: () => {
			if (!selectedMailId) return [];
			return fetchTracking(selectedMailId);
		},
		enabled: !!selectedMailId, // Only query if an ID is selected
	});

	// Derive selectedMailSummary and selectedMailDetail from the thread data
	// Assuming the first item in the thread can serve as a summary, and an item matching selectedMailId as detail
	const selectedMailSummary = useMemo(() => {
		// If threadData exists and has items, use the first one as a summary proxy.
		// This might need refinement if a specific summary fetch is required.
		return threadData?.[0] || null;
	}, [threadData]);

	const selectedMailDetail = useMemo(() => {
		if (!threadData || !selectedMailId) {
			return null;
		}
		// Find the specific mail detail from the thread that matches selectedMailId
		// If not found, fall back to the first item in the thread as a proxy for detail if needed.
		return (
			threadData.find((mail) => mail.id === selectedMailId) ||
			threadData[0] ||
			null
		);
	}, [threadData, selectedMailId]);

	const isLoading = isLoadingThread || isLoadingTracking;
	const isError = isErrorThread || isErrorTracking;
	const error = errorThread || errorTracking;

	return {
		selectedMailSummary,
		selectedMailDetail,
		trackingData: trackingData || [], // Provide tracking data
		isLoading,
		isError,
		error,
	};
};
