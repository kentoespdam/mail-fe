"use client";

import { memo, useCallback, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useMailDetailState } from "@/hooks/persuratan/use-mail-detail-state";
import { useMailListState } from "@/hooks/persuratan/use-mail-list-state";
import { useMailNavigation } from "@/hooks/persuratan/use-mail-navigation";
import { MailDetail } from "./mail-detail";
import { MailFolderTree } from "./mail-folder-tree";
import { MailList } from "./mail-list";
import { MailListToggle } from "./mail-list-toggle";
import { MailToolbar } from "./mail-toolbar";

export const PersuratanContent = memo(() => {
	const navigation = useMailNavigation();
	const mailList = useMailListState(navigation.selectedFolderId);
	const mailDetail = useMailDetailState(navigation.selectedMailId);
	const [isListHidden, setIsListHidden] = useState(false);

	const toggleList = useCallback(() => setIsListHidden((v) => !v), []);

	return (
		<SidebarProvider className="h-[calc(100svh-80px-var(--footer-height,3rem))] min-h-0 overflow-hidden bg-background">
			<Sidebar
				collapsible="icon"
				className="border-r top-20! h-[calc(100svh-80px-var(--footer-height,3rem))]!"
			>
				<MailFolderTree
					selectedFolderId={navigation.selectedFolderId}
					onSelectFolder={navigation.selectFolder}
				/>
				<SidebarRail />
			</Sidebar>

			<SidebarInset className="overflow-hidden">
				<div className="flex flex-col h-full overflow-hidden">
					<MailToolbar
						onSearch={mailList.handleSearch}
						onDateFilter={(start, end) => console.log(start, end)}
						selectedMailId={navigation.selectedMailId}
						selectedFolderId={navigation.selectedFolderId}
						selectedMailIds={
							navigation.selectedMailId ? [navigation.selectedMailId] : []
						}
						mailStatus={mailDetail.selectedMailSummary?.status?.toString()}
					/>

					<div className="relative flex-1 flex flex-col overflow-hidden">
						{!isListHidden ? (
							<ResizablePanelGroup orientation="vertical">
								<ResizablePanel defaultSize={35} minSize={25}>
									<div className="h-full p-1">
										<MailList
											mails={mailList.data}
											selectedMailId={navigation.selectedMailId}
											onSelectMail={navigation.selectMail}
											page={mailList.page}
											pageSize={mailList.pageSize}
											totalElements={mailList.totalElements}
											onPageChange={mailList.handlePageChange}
											onPageSizeChange={mailList.handlePageSizeChange}
											sorting={mailList.sorting}
											onSortingChange={mailList.handleSortingChange}
										/>
									</div>
								</ResizablePanel>

								<ResizableHandle>
									<MailListToggle hidden={false} onToggle={toggleList} />
								</ResizableHandle>

								<ResizablePanel defaultSize={55} minSize={20}>
									<div className="h-full bg-muted/5 p-1 overflow-auto">
										<MailDetail mail={mailDetail.selectedMailDetail} />
									</div>
								</ResizablePanel>
							</ResizablePanelGroup>
						) : (
							<div className="flex flex-col h-full overflow-hidden">
								<div className="flex h-7 shrink-0 items-center justify-center border-b border-border bg-background">
									<MailListToggle hidden={true} onToggle={toggleList} />
								</div>
								<div className="flex-1 bg-muted/5 p-1 overflow-auto">
									<MailDetail mail={mailDetail.selectedMailDetail} />
								</div>
							</div>
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
});

PersuratanContent.displayName = "PersuratanContent";
