import type { PagedResponse } from "@/types/commons";
import type {
	MailCreateRequest,
	MailReportDto,
	MailResponse,
	MailSearchParams,
	MailSendRequest,
	MailSummaryDto,
	MailTrackingDto,
	MailUpdateRequest,
	RecipientReadStatusDto,
	ThreadMailDto,
} from "@/types/mail";

const BASE = "/api/proxy/v1/mails";

/**
 * Adapter untuk mengubah PagedResponse flat dari backend
 * menjadi struktur PagedResponse<T> yang diharapkan UI.
 */
function mapPagedResponse<T>(res: PagedResponse<T>): PagedResponse<T> {
	return {
		content: res.content,
		page: res.page,
	};
}

export async function fetchMailsInFolder(
	folderId: string,
	params: {
		keyword?: string;
		startDate?: string;
		endDate?: string;
		page?: number;
		size?: number;
		sortBy?: string;
		sortDir?: string;
	},
): Promise<PagedResponse<MailSummaryDto>> {
	const query = new URLSearchParams();
	if (params.keyword) query.set("keyword", params.keyword);
	if (params.startDate) query.set("sdate", params.startDate);
	if (params.endDate) query.set("edate", params.endDate);
	if (params.page !== undefined) query.set("page", String(params.page));
	if (params.size !== undefined) query.set("size", String(params.size));
	if (params.sortBy) query.set("sortBy", params.sortBy);
	if (params.sortDir) query.set("sortDir", params.sortDir);

	const res = await fetch(
		`/api/proxy/v1/mail/folders/${folderId}/mails?${query}`,
	);
	if (!res.ok) throw new Error("Gagal memuat daftar surat");

	const data = await res.json();
	if (Array.isArray(data)) {
		return {
			content: data,
			page: {
				number: params.page || 0,
				size: params.size || data.length,
				totalElements: data.length, // Fallback bila bukan paged
				totalPages: 1,
			},
		};
	}
	return mapPagedResponse<MailSummaryDto>(data);
}

export async function searchMailsReport(
	params: MailSearchParams,
): Promise<PagedResponse<MailReportDto>> {
	const query = new URLSearchParams();
	if (params.keyword) query.set("keyword", params.keyword);
	if (params.mailTypeId) query.set("mailTypeId", params.mailTypeId);
	if (params.mailCategoryId) query.set("mailCategoryId", params.mailCategoryId);
	if (params.startDate) query.set("startDate", params.startDate);
	if (params.endDate) query.set("endDate", params.endDate);
	query.set("page", String(params.page));
	query.set("size", String(params.size));
	if (params.sortBy) query.set("sortBy", params.sortBy);
	if (params.sortDir) query.set("sortDir", params.sortDir);

	const res = await fetch(`${BASE}/report?${query}`);
	if (!res.ok) throw new Error("Gagal memuat laporan surat");
	return mapPagedResponse<MailReportDto>(await res.json());
}

export async function fetchThread(id: string): Promise<ThreadMailDto[]> {
	const res = await fetch(`${BASE}/${id}/thread`);
	if (!res.ok) throw new Error("Gagal memuat thread surat");
	return res.json();
}

export async function fetchTracking(id: string): Promise<MailTrackingDto[]> {
	const res = await fetch(`${BASE}/${id}/tracking`);
	if (!res.ok) throw new Error("Gagal memuat tracking surat");
	return res.json();
}

export async function fetchReadStatus(
	id: string,
): Promise<RecipientReadStatusDto[]> {
	const res = await fetch(`${BASE}/${id}/read-status`);
	if (!res.ok) throw new Error("Gagal memuat status baca surat");
	return res.json();
}

export async function createDraft(
	data: MailCreateRequest,
): Promise<MailResponse> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat draft surat");
	}
	return res.json();
}

export async function updateDraft(
	id: string,
	data: MailUpdateRequest,
): Promise<MailResponse> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui draft surat");
	}
	return res.json();
}

export async function sendFromDraft(id: string): Promise<MailResponse> {
	const res = await fetch(`${BASE}/${id}/send`, { method: "POST" });
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengirim surat");
	}
	return res.json();
}

export async function sendMailDirect(
	data: MailSendRequest,
): Promise<MailResponse> {
	const res = await fetch(`${BASE}/send`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengirim surat");
	}
	return res.json();
}

export async function markRead(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}/read`, { method: "POST" });
	if (!res.ok) throw new Error("Gagal menandai surat sebagai dibaca");
}

export async function deleteMail(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus surat");
}

export async function restoreMailRoot(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}/restore`, { method: "POST" });
	if (!res.ok) throw new Error("Gagal memulihkan surat");
}
