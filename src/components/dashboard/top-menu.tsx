"use client";

import {
	IconArchive,
	IconBroadcast,
	IconChartHistogram,
	IconFileDescription,
	IconFileSearch,
	IconFileSettings,
	IconLayoutDashboard,
	IconMail,
	IconSettings2,
} from "@tabler/icons-react";
import Link from "next/link";
import { memo } from "react";
import {
	Menubar,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const MenuAplikasi = memo(() => (
	<MenubarMenu>
		<Tooltip>
			<TooltipTrigger
				render={
					<MenubarTrigger
						className="flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-accent/50 data-active:bg-accent cursor-pointer"
						aria-label="Menu Aplikasi"
					>
						<IconLayoutDashboard
							className="size-5 lg:size-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<span className="hidden lg:inline">Menu Aplikasi</span>
					</MenubarTrigger>
				}
			/>
			<TooltipContent side="bottom">Menu Aplikasi</TooltipContent>
		</Tooltip>
		<MenubarContent className="w-fit">
			<MenubarGroup>
				<MenubarItem render={<Link href="/dashboard" />}>
					<IconChartHistogram
						className="size-4 text-muted-foreground"
						aria-hidden="true"
					/>
					Dashboard
				</MenubarItem>
				<MenubarItem render={<Link href="/persuratan" />}>
					<IconMail
						className="size-4 text-muted-foreground"
						aria-hidden="true"
					/>
					Persuratan
				</MenubarItem>
			</MenubarGroup>
			<MenubarSeparator />
			<MenubarGroup>
				<MenubarSub>
					<MenubarSubTrigger>
						<IconArchive
							className="size-4 text-muted-foreground"
							aria-hidden="true"
						/>
						Arsip Surat
					</MenubarSubTrigger>
					<MenubarSubContent>
						<MenubarItem render={<Link href="#" />}>
							<IconFileSettings
								className="size-4 text-muted-foreground"
								aria-hidden="true"
							/>
							Administrasi Persuratan
						</MenubarItem>
						<MenubarItem render={<Link href="#" />}>
							<IconFileSearch
								className="size-4 text-muted-foreground"
								aria-hidden="true"
							/>
							Pencarian Surat
						</MenubarItem>
						<MenubarItem render={<Link href="#" />}>
							<IconFileDescription
								className="size-4 text-muted-foreground"
								aria-hidden="true"
							/>
							Laporan Administrasi Surat
						</MenubarItem>
					</MenubarSubContent>
				</MenubarSub>
			</MenubarGroup>
			<MenubarSeparator />
			<MenubarGroup>
				<MenubarItem render={<Link href="/publikasi" />}>
					<IconBroadcast
						className="size-4 text-muted-foreground"
						aria-hidden="true"
					/>
					Publikasi Dokumen
				</MenubarItem>
			</MenubarGroup>
			<MenubarSeparator />
			<MenubarGroup>
				<MenubarItem render={<Link href="/master/tipe-surat" />}>
					<IconSettings2
						className="size-4 text-muted-foreground"
						aria-hidden="true"
					/>
					Master Mail
				</MenubarItem>
			</MenubarGroup>
		</MenubarContent>
	</MenubarMenu>
));

MenuAplikasi.displayName = "MenuAplikasi";

const TopBarMenu = memo(() => {
	return (
		<Menubar>
			<MenuAplikasi />
		</Menubar>
	);
});

TopBarMenu.displayName = "TopBarMenu";

export default TopBarMenu;
