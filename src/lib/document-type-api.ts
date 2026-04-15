import type {
	DocumentTypeDto,
	DocumentTypePayload,
	PageDocumentType,
} from "@/types/document-type";

const BASE = "/api/proxy/v1/document-types";

export async function fetchDocumentTypes(
	page = 0,
	size = 20,
	search?: string,
	sortBy?: string,
	sortDir?: string,
): Promise<PageDocumentType> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));
	if (search) params.set("search", search);
	if (sortBy) params.set("sortBy", sortBy);
	if (sortDir) params.set("sortDir", sortDir);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data jenis dokumen");
	return res.json();
}

export const fetchDocumentTypesLookup = async () => {
	const res = await fetch(`${BASE}/lookup`);
	if (!res.ok) throw new Error("Gagal memuat data jenis dokumen");
	const result = await res.json();
	return result;
};

export async function fetchDocumentType(id: string): Promise<DocumentTypeDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail jenis dokumen");
	return res.json();
}

export async function createDocumentType(
	data: DocumentTypePayload,
): Promise<DocumentTypeDto> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat jenis dokumen");
	}
	return res.json();
}

export async function updateDocumentType(
	id: string,
	data: DocumentTypePayload,
): Promise<DocumentTypeDto> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui jenis dokumen");
	}
	return res.json();
}

export async function deleteDocumentType(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus jenis dokumen");
}

export async function toggleDocumentTypeStatus(
	id: string,
): Promise<DocumentTypeDto> {
	const res = await fetch(`${BASE}/${id}/status`, {
		method: "PATCH",
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengubah status jenis dokumen");
	}
	return res.json();
}
