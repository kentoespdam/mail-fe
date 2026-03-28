import type {
	PageQuickMessage,
	QuickMessageDto,
	QuickMessagePayload,
} from "@/types/quick-message";

const BASE = "/api/proxy/quick-messages";

export async function fetchQuickMessages(
	page = 0,
	size = 20,
): Promise<PageQuickMessage> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data pesan singkat");
	return res.json();
}

export async function fetchQuickMessage(id: number): Promise<QuickMessageDto> {
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
	id: number,
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

export async function deleteQuickMessage(id: number): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus pesan singkat");
}
