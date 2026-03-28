import type {
	CreatePublicationPayload,
	PublicationDto,
	PublicationFilter,
	UpdatePublicationPayload,
} from "@/types/publication";

const BASE = "/api/proxy/publications";

export async function fetchPublications(
	filter: PublicationFilter = {},
	offset = 0,
	limit = 20,
): Promise<PublicationDto[]> {
	const params = new URLSearchParams();
	if (filter.status) params.set("status", filter.status);
	if (filter.keyword) params.set("keyword", filter.keyword);
	if (filter.typeId) params.set("typeId", String(filter.typeId));
	params.set("offset", String(offset));
	params.set("limit", String(limit));

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data publikasi");
	return res.json();
}

export async function fetchPublication(id: number): Promise<PublicationDto> {
	const res = await fetch(`${BASE}/${id}`);
	if (!res.ok) throw new Error("Gagal memuat detail publikasi");
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
	id: number,
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

export async function deletePublication(id: number): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus publikasi");
}
