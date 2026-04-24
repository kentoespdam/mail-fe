import type {
	BatchRecipientResponse,
	RecipientBatchRequest,
	RecipientDeleteBatchRequest,
	RecipientDto,
} from "@/types/mail";

const BASE = "/api/proxy/v1/mails";

export async function fetchRecipients(mailId: string): Promise<RecipientDto[]> {
	const res = await fetch(`${BASE}/${mailId}/recipients`);
	if (!res.ok) throw new Error("Gagal memuat penerima surat");
	return res.json();
}

export async function addRecipient(
	mailId: string,
	data: { empId: string; circulation: string },
): Promise<RecipientDto> {
	const res = await fetch(`${BASE}/${mailId}/recipients`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal menambah penerima");
	}
	return res.json();
}

export async function addRecipientsBatch(
	mailId: string,
	data: RecipientBatchRequest,
): Promise<BatchRecipientResponse> {
	const res = await fetch(`${BASE}/${mailId}/recipients/batch`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal menambah penerima (batch)");
	}
	return res.json();
}

export async function deleteRecipient(
	mailId: string,
	rid: string,
): Promise<void> {
	const res = await fetch(`${BASE}/${mailId}/recipients/${rid}`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error("Gagal menghapus penerima");
}

export async function deleteRecipientsBatch(
	mailId: string,
	data: RecipientDeleteBatchRequest,
): Promise<void> {
	const res = await fetch(`${BASE}/${mailId}/recipients`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Gagal menghapus penerima (batch)");
}

export async function updateNotifFlags(
	mailId: string,
	rid: string,
	data: { emailNotif: number; smsNotif: number },
): Promise<RecipientDto> {
	const res = await fetch(`${BASE}/${mailId}/recipients/${rid}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Gagal memperbarui notifikasi penerima");
	return res.json();
}

export async function copyThread(
	mailId: string,
	refId: string,
): Promise<RecipientDto[]> {
	const res = await fetch(`${BASE}/${mailId}/recipients/copy-thread/${refId}`, {
		method: "POST",
	});
	if (!res.ok) throw new Error("Gagal menyalin thread penerima");
	return res.json();
}

export async function copyFrom(
	mailId: string,
	refId: string,
): Promise<RecipientDto[]> {
	const res = await fetch(`${BASE}/${mailId}/recipients/copy-from/${refId}`, {
		method: "POST",
	});
	if (!res.ok) throw new Error("Gagal menyalin penerima");
	return res.json();
}
