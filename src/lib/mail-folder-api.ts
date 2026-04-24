import type {
	FolderCounterDto,
	MailFolderDto,
	MailFolderRequest,
	MoveMailRequest,
} from "@/types/mail";

const BASE = "/api/proxy/v1/mail/folders";

export async function fetchFolderTree(): Promise<MailFolderDto[]> {
	const res = await fetch(BASE);
	if (!res.ok) throw new Error("Gagal memuat struktur folder");
	return res.json();
}

export async function fetchFolderCounters(): Promise<FolderCounterDto[]> {
	const res = await fetch(`${BASE}/counters`);
	if (!res.ok) throw new Error("Gagal memuat penghitung folder");
	return res.json();
}

export async function createFolder(
	data: MailFolderRequest,
): Promise<MailFolderDto> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal membuat folder");
	}
	return res.json();
}

export async function renameFolder(
	id: string,
	data: MailFolderRequest,
): Promise<MailFolderDto> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengubah nama folder");
	}
	return res.json();
}

export async function deleteFolder(id: string): Promise<void> {
	const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal menghapus folder");
	}
}

export async function moveMails(data: MoveMailRequest): Promise<void> {
	const res = await fetch(`${BASE}/move`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memindahkan surat");
	}
}

export async function restoreMailToFolder(id: string): Promise<void> {
	const res = await fetch(`/api/proxy/v1/mail/mails/${id}/restore`, {
		method: "POST",
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal memulihkan surat");
	}
}

export async function deleteMailFromFolder(id: string): Promise<void> {
	const res = await fetch(`/api/proxy/v1/mail/mails/${id}/delete`, {
		method: "POST",
	});
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal menghapus surat dari folder");
	}
}

export async function emptyTrash(): Promise<void> {
	const res = await fetch("/api/proxy/v1/mail/trash", { method: "DELETE" });
	if (!res.ok) {
		const err = await res.json().catch(() => null);
		throw new Error(err?.detail ?? "Gagal mengosongkan tempat sampah");
	}
}
