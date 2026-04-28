export enum AttachmentRefType {
	MAIL = 1,
	ARCHIVE = 2,
}

export interface AttachmentResponse {
	id: string;
	refType: number;
	refId: string;
	originalFilename: string;
	fileExt: string;
	fileSize: number;
	docNotes: string | null;
	uploadDate: string;
	uploadByName: string;
}

export interface AttachmentDetailResponse {
	id: string;
	originalFilename: string;
	fileExt: string;
	fileSize: number;
	docNotes: string | null;
	uploadDate: string;
	uploadByName: string;
}

export type AttachmentDto = AttachmentResponse;
