import type {
	PageQuickMessage,
	QuickMessageDto,
	QuickMessagePayload,
} from "@/types/quick-message";

const BASE = "/api/proxy/v1/quick-messages";

export async function fetchQuickMessages(
	page = 0,
	size = 20,
	search?: string,
	sortBy?: string,
	sortDir?: string,
): Promise<PageQuickMessage> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));
	if (search) params.set("search", search);
	if (sortBy) params.set("sortBy", sortBy);
	if (sortDir) params.set("sortDir", sortDir);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data pesan singkat");
	return res.json();
}

export const fetchQuickMessagesLookup = async () => {
	const res = await fetch(`${BASE}/lookup`);
	if (!res.ok) throw new Error("Gagal memuat data lookup pesan singkat");
	return res.json();
};

export async function fetchQuickMessage(id: string): Promise<QuickMessageDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail pesan singkat");
	return res.json();
}

export async function createQuickMessage(
	data: QuickMessagePayload,
): Promise<QuickMessageDto> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat pesan singkat");
	}
	return res.json();
}

export async function updateQuickMessage(
	id: string,
	data: QuickMessagePayload,
): Promise<QuickMessageDto> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui pesan singkat");
	}
	return res.json();
}

export async function deleteQuickMessage(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus pesan singkat");
}

export async function toggleQuickMessageStatus(
	id: string,
): Promise<QuickMessageDto> {
	const res = await fetch(`${BASE}/${id}/status`, {
		method: "PATCH",
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengubah status pesan singkat");
	}
	return res.json();
}
