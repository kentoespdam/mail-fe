"use client";

import { memo } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMailDetailState } from "@/hooks/persuratan/use-mail-detail-state";
import { useMailListState } from "@/hooks/persuratan/use-mail-list-state";
import { useMailNavigation } from "@/hooks/persuratan/use-mail-navigation";
import { DUMMY_FOLDERS } from "@/lib/dummy/mail-dummy";
import { MailDetail } from "./mail-detail";
import { MailFolderTree } from "./mail-folder-tree";
import { MailList } from "./mail-list";
import { MailToolbar } from "./mail-toolbar";

export const PersuratanContent = memo(() => {
	const navigation = useMailNavigation();
	const mailList = useMailListState(navigation.selectedFolderId);
	const mailDetail = useMailDetailState(navigation.selectedMailId);

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
								selectedFolderId={navigation.selectedFolderId}
								onSelectFolder={navigation.selectFolder}
							/>
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				{/* Main Content Panel */}
				<ResizablePanel defaultSize={85}>
					<div className="flex flex-col h-full overflow-hidden">
						<MailToolbar
							onSearch={mailList.handleSearch}
							onDateFilter={(start, end) => console.log(start, end)}
							selectedMailId={navigation.selectedMailId}
							selectedFolderId={navigation.selectedFolderId}
							mailStatus={mailDetail.selectedMailSummary?.status}
						/>

						<div className="flex-1 flex flex-col overflow-hidden">
							<ResizablePanelGroup orientation="vertical">
								<ResizablePanel defaultSize={55} minSize={25}>
									<div className="h-full p-1">
										<MailList
											mails={mailList.filteredMails}
											selectedMailId={navigation.selectedMailId}
											onSelectMail={navigation.selectMail}
											page={mailList.page}
											pageSize={mailList.pageSize}
											totalElements={mailList.filteredMails.length}
											onPageChange={mailList.handlePageChange}
											onPageSizeChange={mailList.handlePageSizeChange}
											sorting={mailList.sorting}
											onSortingChange={mailList.handleSortingChange}
										/>
									</div>
								</ResizablePanel>

								<ResizableHandle withHandle />

								<ResizablePanel defaultSize={45} minSize={20}>
									<div className="h-full bg-muted/5 p-1 overflow-auto">
										<MailDetail mail={mailDetail.selectedMailDetail} />
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
