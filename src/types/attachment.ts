export enum AttachmentRefType {
	MAIL = 1,
	ARCHIVE = 2,
}

export interface AttachmentDto {
	id: string;
	refId: string;
	refType: AttachmentRefType;
	fileName: string;
	fileSize: number;
	contentType: string;
	docNotes: string | null;
	uploadDate: string;
	uploadedBy: string;
	uploadedByName: string;
}
