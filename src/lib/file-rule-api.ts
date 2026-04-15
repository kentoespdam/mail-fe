import type {
	FileRuleDto,
	FileRulePayload,
	PageFileRule,
} from "@/types/file-rule";

const BASE = "/api/proxy/v1/file-rules";

export async function fetchFileRules(
	page = 0,
	size = 20,
	search?: string,
	context?: string,
	sortBy?: string,
	sortDir?: string,
): Promise<PageFileRule> {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("size", String(size));
	if (search) params.set("search", search);
	if (context) params.set("context", context);
	if (sortBy) params.set("sortBy", sortBy);
	if (sortDir) params.set("sortDir", sortDir);

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat data aturan file");
	return res.json();
}

export const fetchFileRulesLookup = async (context: string) => {
	const params = new URLSearchParams();
	params.set("context", context);
	const res = await fetch(`${BASE}/lookup?${params}`);
	if (!res.ok) throw new Error("Gagal memuat lookup aturan file");
	return res.json();
};

export async function createFileRule(
	data: FileRulePayload,
): Promise<FileRuleDto> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat aturan file");
	}
	return res.json();
}

export async function updateFileRule(
	id: string,
	data: FileRulePayload,
): Promise<FileRuleDto> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memperbarui aturan file");
	}
	return res.json();
}

export async function deleteFileRule(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus aturan file");
}
