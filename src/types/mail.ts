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
	readStatus: number; // 0: unread, 1: read
	folderId: string;
	type: MailTypeLookup;
	category: MailCategoryLookup;
	circulationName: string;
	maxResponseDate: string | null;
	thread: MailThreadInfo;
	totalCount: number;
}

export interface MailDetailDto {
	id: string;
	mailNumber: string;
	mailDate: string;
	type: MailTypeLookup;
	category: MailCategoryLookup;
	subject: string;
	content: string;
	note: string;
	maxResponseDate: string | null;
	status: string;
	thread: MailThreadInfo;
	summary: MailSummaryInfo;
	audit: MailAuditInfo;
	noSuratMasuk: string | null;
	asalSuratMasuk: string | null;
	tglSuratMasuk: string | null;
	tujuanSuratKeluar: string | null;
	penerimaSuratKeluar: string | null;
	circulationName: string;
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
