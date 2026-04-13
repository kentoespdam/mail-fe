import type { PagedResponse } from "@/types/commons";
import type {
	CreatePublicationPayload,
	DocumentTypeLookup,
	PublicationDto,
	UpdatePublicationPayload,
} from "@/types/publication";

const BASE = "/api/proxy/v1/publications";

export async function fetchPublications(
	page = 0,
	size = 20,
	search?: string,
	status?: string,
	sortBy?: string,
	sortDir?: string,
): Promise<PagedResponse<PublicationDto>> {
	const params = new URLSearchParams();
	if (status) params.set("status", status);
	if (search) params.set("keyword", search);
	params.set("page", String(page));
	params.set("size", String(size));
	if (sortBy) params.set("sortBy", sortBy);
	if (sortDir) params.set("sortDir", sortDir);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data publikasi");
	return res.json();
}

export async function fetchPublication(id: string): Promise<PublicationDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail publikasi");
	return res.json();
}

export async function fetchDocumentTypesLookup(): Promise<
	DocumentTypeLookup[]
> {
	const res = await fetch("/api/proxy/v1/document-types/lookup");
	if (!res.ok) throw new Error("Gagal memuat tipe dokumen");
	return res.json();
}

export async function createPublication(
	data: CreatePublicationPayload,
	file?: File,
): Promise<PublicationDto> {
	const formData = new FormData();
	formData.append(
		"data",
		new Blob([JSON.stringify(data)], { type: "application/json" }),
	);
	if (file) formData.append("file", file);

	const res = await fetch(BASE, { method: "POST", body: formData });
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat publikasi");
	}
	return res.json();
}

export async function updatePublication(
	id: string,
	data: UpdatePublicationPayload,
	file?: File,
): Promise<PublicationDto> {
	const formData = new FormData();
	formData.append(
		"data",
		new Blob([JSON.stringify(data)], { type: "application/json" }),
	);
	if (file) formData.append("file", file);

	const res = await fetch(`${BASE}/${id}`, { method: "PUT", body: formData });
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui publikasi");
	}
	return res.json();
}

export async function deletePublication(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus publikasi");
}

export async function publishPublication(id: string): Promise<PublicationDto> {
	const res = await fetch(`${BASE}/${id}/publish`, {
		method: "PATCH",
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal menerbitkan publikasi");
	}
	return res.json();
}
