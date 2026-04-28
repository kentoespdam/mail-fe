import type { AttachmentResponse } from "@/types/attachment";

export interface MailTypeLookup {
	id: string;
	name: string;
}

export interface MailCategoryLookup {
	id: string;
	name: string;
}

export interface MailAuditInfo {
	createdBy: string;
	createdByName: string;
	createdDate: string;
	updatedDate: string;
}

export interface MailSummaryInfo {
	attachmentQty: number;
	toStr: string;
}

export interface MailThreadInfo {
	rootMailId: string | null;
	parentMailId: string | null;
}

export interface MailFolderLookup {
	id: string;
	name: string;
}

export interface MailFolderDto {
	id: string;
	parentFolderId: string | null;
	ownerId: string;
	name: string;
	iconCls: string;
	system: boolean;
	unread: number;
	total: number;
}

export interface MailSummaryDto {
	id: string;
	mailNumber: string;
	mailDate: string;
	subject: string;
	audit: MailAuditInfo;
	summary: MailSummaryInfo;
	readStatus: number;
	folderId: string;
	type: MailTypeLookup;
	category: MailCategoryLookup;
	circulationName: string;
	maxResponseDate: string | null;
	thread: MailThreadInfo;
	totalCount: number;
	status: string | number;
	restoreFolder?: MailFolderLookup;
}

/**
 * ThreadMailDto used for detail source.
 * Similar to MailSummaryDto but with optional content/note.
 */
export interface ThreadMailDto extends MailSummaryDto {
	content?: string;
	note?: string;
	noSuratMasuk?: string | null;
	asalSuratMasuk?: string | null;
	tglSuratMasuk?: string | null;
	tujuanSuratKeluar?: string | null;
	penerimaSuratKeluar?: string | null;
	attachments?: AttachmentResponse[];
}

export interface MailDetailDto {
	id: string;
	mailNumber: string;
	mailDate: string;
	type: MailTypeLookup;
	category: MailCategoryLookup;
	subject: string;
	content?: string;
	note?: string;
	maxResponseDate: string | null;
	status: string | number;
	thread: MailThreadInfo;
	summary: MailSummaryInfo;
	audit: MailAuditInfo;
	noSuratMasuk?: string | null;
	asalSuratMasuk?: string | null;
	tglSuratMasuk?: string | null;
	tujuanSuratKeluar?: string | null;
	penerimaSuratKeluar?: string | null;
	circulationName: string;
	attachments?: AttachmentResponse[];
}

export interface MailResponse extends MailDetailDto {}

export interface MailTrackingDto {
	recipientId: string;
	empName: string;
	posName: string;
	circulationName: string;
	isRead: boolean;
	readDate: string | null;
}

export interface RecipientReadStatusDto {
	recipientId: string;
	userId: string;
	empName: string;
	posName: string;
	circulationName: string;
	readStatus: number;
	readDate: string | null;
}

export interface MailReportDto {
	mailTypeName: string;
	mailCategoryName: string;
	totalMails: number;
	totalRead: number;
	totalUnread: number;
	totalCount: number;
}

export interface RecipientDto {
	id: string;
	employee: {
		userId: string;
		empId: string;
		empName: string;
		posName: string;
	};
	circulation: {
		type: string; // ASLI, TEMBUSAN
		name: string;
	};
	notifications: {
		emailNotif: number;
		smsNotif: number;
		notified: boolean;
		read: boolean;
		folderPosition: number;
	};
}

export interface BatchRecipientResponse {
	succeeded: RecipientDto[];
	failed: {
		empId: string;
		reason: string;
	}[];
	totalRequested: number;
	totalSucceeded: number;
	totalFailed: number;
}

export interface FolderCounterDto {
	folderId: string;
	folderName: string;
	unread: number;
	total: number;
}

export interface MailSearchParams {
	keyword?: string;
	mailTypeId?: string;
	mailCategoryId?: string;
	startDate?: string;
	endDate?: string;
	page: number;
	size: number;
	sortBy?: string;
	sortDir?: string;
}

// Request Types

export interface MailFolderRequest {
	name: string;
	parentFolderId: string;
}

export interface MoveMailRequest {
	mailIds: string[];
	fromFolderId: string;
	toFolderId: string;
}

export interface MailCreateRequest {
	subject: string;
	content?: string;
	note?: string;
	mailTypeId: string;
	mailCategoryId: string;
	mailDate?: string;
	maxResponseDate?: string;
	rootMailId?: string;
	parentMailId?: string;
	noSuratMasuk?: string;
	asalSuratMasuk?: string;
	tglSuratMasuk?: string;
	tujuanSuratKeluar?: string;
	penerimaSuratKeluar?: string;
}

export interface MailUpdateRequest extends MailCreateRequest {}

export interface RecipientBatchRequest {
	empIds: string[];
	circulation: string; // ASLI, TEMBUSAN
}

export interface RecipientDeleteBatchRequest {
	ids: string[];
}

export interface MailSendRequest extends MailCreateRequest {
	recipients: RecipientBatchRequest[];
}

export interface MailLookupResponse {
	id: string;
	mailDate: string;
	createdByName: string;
	subject: string;
	typeName: string;
	categoryName: string;
	circulationName: string;
	maxResponseDate: string | null;
	isRead: boolean;
}
