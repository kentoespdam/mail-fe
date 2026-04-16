"use client";

import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
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
	const [sorting, setSorting] = useState<SortingState>([]);

	// Filtering logic for dummy data
	const filteredMails = useMemo(() => {
		return DUMMY_MAILS.filter((mail) => {
			const matchesFolder = mail.folderId === selectedFolderId;
			const matchesKeyword =
				mail.subject.toLowerCase().includes(keyword.toLowerCase()) ||
				mail.mailNumber.toLowerCase().includes(keyword.toLowerCase());
			return matchesFolder && matchesKeyword;
		});
	}, [selectedFolderId, keyword]);

	const selectedMailSummary = useMemo(() => {
		return DUMMY_MAILS.find((m) => m.id === selectedMailId);
	}, [selectedMailId]);

	const selectedMailDetail = useMemo(() => {
		return selectedMailId === "mail-1" ? DUMMY_MAIL_DETAIL : null;
	}, [selectedMailId]);

	const handleSelectMail = useCallback((mailId: string) => {
		setSelectedMailId(mailId);
	}, []);

	const handleSelectFolder = useCallback((folderId: string) => {
		setSelectedFolderId(folderId);
		setSelectedMailId(null);
		setPage(0);
	}, []);

	const handleSearch = useCallback((newKeyword: string) => {
		setKeyword(newKeyword);
		setPage(0);
	}, []);

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handlePageSizeChange = useCallback((newSize: number) => {
		setPageSize(newSize);
		setPage(0);
	}, []);

	const handleSortingChange: OnChangeFn<SortingState> = useCallback(
		(updaterOrValue) => {
			setSorting(updaterOrValue);
		},
		[],
	);

	return (
		<div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-background">
			<ResizablePanelGroup orientation="horizontal" className="flex-1">
				{/* Sidebar Panel */}
				<ResizablePanel defaultSize={15} minSize={10} className="bg-muted/10">
					<div className="flex flex-col h-full border-r bg-muted/5">
						<div className="p-2 border-b bg-muted/20">
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
							onSearch={handleSearch}
							onDateFilter={(start, end) => console.log(start, end)}
							selectedMailId={selectedMailId}
							selectedFolderId={selectedFolderId}
							mailStatus={selectedMailSummary?.status}
						/>

						<div className="flex-1 flex flex-col overflow-hidden">
							<ResizablePanelGroup orientation="vertical">
								<ResizablePanel defaultSize={55} minSize={25}>
									<div className="h-full p-1">
										<MailList
											mails={filteredMails}
											selectedMailId={selectedMailId}
											onSelectMail={handleSelectMail}
											page={page}
											pageSize={pageSize}
											totalElements={filteredMails.length}
											onPageChange={handlePageChange}
											onPageSizeChange={handlePageSizeChange}
											sorting={sorting}
											onSortingChange={handleSortingChange}
										/>
									</div>
								</ResizablePanel>

								<ResizableHandle withHandle />

								<ResizablePanel defaultSize={45} minSize={20}>
									<div className="h-full bg-muted/5 p-1 overflow-auto">
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
