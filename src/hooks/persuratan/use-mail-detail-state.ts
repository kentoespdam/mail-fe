"use client";

import { useMemo } from "react";
import { DUMMY_MAIL_DETAIL, DUMMY_MAILS } from "@/lib/dummy/mail-dummy";

export const useMailDetailState = (selectedMailId: string | null) => {
	const selectedMailSummary = useMemo(() => {
		return DUMMY_MAILS.find((m) => m.id === selectedMailId);
	}, [selectedMailId]);

	const selectedMailDetail = useMemo(() => {
		// Mock logic: only "mail-1" has detailed content in dummy
		return selectedMailId === "mail-1" ? DUMMY_MAIL_DETAIL : null;
	}, [selectedMailId]);

	return {
		selectedMailSummary,
		selectedMailDetail,
	};
};
