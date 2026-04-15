"use client";

import { memo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
	DUMMY_FOLDERS,
	DUMMY_MAIL_DETAIL,
	DUMMY_MAILS,
} from "@/lib/dummy/mail-dummy";
import { MailDetail } from "./mail-detail";
import { MailFolderTree } from "./mail-folder-tree";
import { MailList } from "./mail-list";
import { MailToolbar } from "./mail-toolbar";

export const PersuratanContent = memo(() => {
	const [selectedFolderId, setSelectedFolderId] = useState<string>("inbox");
	const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	// Filtering logic for dummy data
	const filteredMails = DUMMY_MAILS.filter((mail) => {
		const matchesFolder = mail.folderId === selectedFolderId;
		const matchesKeyword =
			mail.subject.toLowerCase().includes(keyword.toLowerCase()) ||
			mail.mailNumber.toLowerCase().includes(keyword.toLowerCase());
		return matchesFolder && matchesKeyword;
	});

	const selectedMailDetail =
		selectedMailId === "mail-1" ? DUMMY_MAIL_DETAIL : null;

	const handleSelectMail = (mailId: string) => {
		setSelectedMailId(mailId);
	};

	const handleSelectFolder = (folderId: string) => {
		setSelectedFolderId(folderId);
		setSelectedMailId(null);
		setPage(0);
	};

	return (
		<div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
			<div className="flex flex-1 overflow-hidden gap-4 p-4">
				{/* Sidebar Panel */}
				<Card className="w-64 shrink-0 flex flex-col shadow-sm">
					<div className="p-3 border-b bg-muted/30">
						<h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
							Folders
						</h2>
					</div>
					<div className="flex-1 overflow-auto">
						<MailFolderTree
							folders={DUMMY_FOLDERS}
							selectedFolderId={selectedFolderId}
							onSelectFolder={handleSelectFolder}
						/>
					</div>
				</Card>

				{/* Main Content Panel (Toolbar + List + Detail) */}
				<div className="flex-1 flex flex-col gap-4 overflow-hidden">
					<Card className="flex-1 flex flex-col shadow-sm overflow-hidden">
						<MailToolbar
							onSearch={setKeyword}
							onDateFilter={(start, end) => console.log(start, end)}
						/>

						<div className="flex-1 flex flex-col overflow-hidden">
							<div className="h-[60%] border-b p-2">
								<MailList
									mails={filteredMails}
									selectedMailId={selectedMailId}
									onSelectMail={handleSelectMail}
									page={page}
									pageSize={pageSize}
									totalElements={filteredMails.length}
									onPageChange={setPage}
									onPageSizeChange={setPageSize}
								/>
							</div>
							<div className="h-[40%] bg-muted/5 p-2 overflow-auto">
								<MailDetail mail={selectedMailDetail} />
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
});

PersuratanContent.displayName = "PersuratanContent";
