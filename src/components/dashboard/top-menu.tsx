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

const MenuAplikasi = memo(() => (
	<MenubarMenu>
		<MenubarTrigger className="flex gap-1">
			<IconLayoutDashboard className="h-4 w-4" />
			<span>Menu Aplikasi</span>
		</MenubarTrigger>
		<MenubarContent className="w-fit">
			<MenubarGroup>
				<MenubarItem render={<Link href="/dashboard" />}>
					<IconChartHistogram />
					Dashboard
				</MenubarItem>
				<MenubarItem render={<Link href="/persuratan" />}>
					<IconMail />
					Persuratan
				</MenubarItem>
			</MenubarGroup>
			<MenubarSeparator />
			<MenubarGroup>
				<MenubarSub>
					<MenubarSubTrigger>
						<IconArchive />
						Arsip Surat
					</MenubarSubTrigger>
					<MenubarSubContent>
						<MenubarItem render={<Link href="#" />}>
							<IconFileSettings />
							Administrasi Persuratan
						</MenubarItem>
						<MenubarItem render={<Link href="#" />}>
							<IconFileSearch />
							Pencarian Surat
						</MenubarItem>
						<MenubarItem render={<Link href="#" />}>
							<IconFileDescription />
							Laporan Administrasi Surat
						</MenubarItem>
					</MenubarSubContent>
				</MenubarSub>
			</MenubarGroup>
			<MenubarSeparator />
			<MenubarGroup>
				<MenubarItem render={<Link href="/publikasi" />}>
					<IconBroadcast />
					Publikasi Dokumen
				</MenubarItem>
			</MenubarGroup>
			<MenubarSeparator />
			<MenubarGroup>
				<MenubarItem render={<Link href="/master/tipe-surat" />}>
					<IconSettings2 />
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
