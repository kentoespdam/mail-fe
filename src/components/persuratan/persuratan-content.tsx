"use client";

import { memo, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
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

	const selectedMailSummary = DUMMY_MAILS.find((m) => m.id === selectedMailId);
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
		<div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-background">
			<ResizablePanelGroup orientation="horizontal" className="flex-1">
				{/* Sidebar Panel */}
				<ResizablePanel defaultSize={15} minSize={10} className="bg-muted/10">
					<div className="flex flex-col h-full border-r bg-muted/5">
						<div className="p-3 border-b bg-muted/20">
							<h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Main Content Panel */}
				<ResizablePanel defaultSize={85}>
					<div className="flex flex-col h-full overflow-hidden">
						<MailToolbar
							onSearch={setKeyword}
							onDateFilter={(start, end) => console.log(start, end)}
							selectedMailId={selectedMailId}
							selectedFolderId={selectedFolderId}
							mailStatus={selectedMailSummary?.status}
						/>

						<div className="flex-1 flex flex-col overflow-hidden">
							<ResizablePanelGroup orientation="vertical">
								<ResizablePanel defaultSize={60} minSize={20}>
									<div className="h-full p-2">
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
								</ResizablePanel>

								<ResizableHandle withHandle />

								<ResizablePanel defaultSize={40} minSize={20}>
									<div className="h-full bg-muted/5 p-2 overflow-auto">
										<MailDetail mail={selectedMailDetail} />
									</div>
								</ResizablePanel>
							</ResizablePanelGroup>
						</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
});

PersuratanContent.displayName = "PersuratanContent";
