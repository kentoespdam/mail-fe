import type { AttachmentDto, AttachmentRefType } from "@/types/attachment";

const BASE = "/api/proxy/v1/attachments";

export async function fetchAttachments(
	refType: AttachmentRefType,
	refId: string | number,
): Promise<AttachmentDto[]> {
	const params = new URLSearchParams();
	params.set("refType", String(refType));
	params.set("refId", String(refId));

	const res = await fetch(`${BASE}?${params}`);
	if (!res.ok) throw new Error("Gagal memuat daftar lampiran");
	return res.json();
}

export async function uploadAttachment(
	refType: AttachmentRefType,
	refId: string | number,
	file: File,
	docNotes?: string,
): Promise<AttachmentDto> {
	const params = new URLSearchParams();
	params.set("refType", String(refType));
	params.set("refId", String(refId));
	if (docNotes) params.set("docNotes", docNotes);

	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`${BASE}?${params}`, {
		method: "POST",
		body: formData,
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengunggah lampiran");
	}
	return res.json();
}

export async function deleteAttachment(id: string | number): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Gagal menghapus lampiran");
}

/**
 * Mendapatkan URL download lampiran
 */
export function getAttachmentDownloadUrl(id: string | number): string {
	return `${BASE}/${id}/download`;
}

/**
 * Fetch file lampiran sebagai Blob
 */
export async function downloadAttachment(id: string | number): Promise<Blob> {
	const res = await fetch(getAttachmentDownloadUrl(id));
	if (!res.ok) throw new Error("Gagal mengunduh lampiran");
	return res.blob();
}

/**
 * Trigger download file di browser
 */
export async function triggerAttachmentDownload(
	id: string | number,
	fileName: string,
) {
	try {
		const blob = await downloadAttachment(id);
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.style.display = "none";
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	} catch (error) {
		console.error("Attachment download failed:", error);
		throw error;
	}
}
