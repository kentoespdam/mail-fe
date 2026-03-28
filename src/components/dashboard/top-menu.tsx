"use client";

import {
	IconArchive,
	IconBroadcast,
	IconCategory,
	IconChartHistogram,
	IconFileDescription,
	IconFileSearch,
	IconFileSettings,
	IconKey,
	IconLayoutDashboard,
	IconListLetters,
	IconLogout,
	IconMail,
	IconMailFast,
	IconSettings,
	IconSettings2,
	IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
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
import { useLogout } from "@/hooks/auth-hooks";

const MenuAplikasi = () => (
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
				<MenubarSub>
					<MenubarSubTrigger>
						<IconSettings2 />
						Master Mail
					</MenubarSubTrigger>
					<MenubarSubContent>
						<MenubarItem render={<Link href="/master/pesan-singkat" />}>
							<IconMailFast />
							Pesan Singkat
						</MenubarItem>
						<MenubarItem render={<Link href="#" />}>
							<IconListLetters />
							Tipe Surat
						</MenubarItem>
						<MenubarItem render={<Link href="#" />}>
							<IconCategory />
							Kategori Surat
						</MenubarItem>
					</MenubarSubContent>
				</MenubarSub>
			</MenubarGroup>
		</MenubarContent>
	</MenubarMenu>
);

const MenuSettings = () => (
	<MenubarMenu>
		<MenubarTrigger className="flex gap-1">
			<IconSettings className="h-4 w-4" />
			<span>Pengaturan</span>
		</MenubarTrigger>
		<MenubarContent className="w-fit">
			<MenubarItem render={<Link href="#" />}>
				<IconKey />
				Ubah Password
			</MenubarItem>
			<MenubarItem render={<Link href="#" />}>
				<IconUser />
				Upload Foto Profil
			</MenubarItem>
		</MenubarContent>
	</MenubarMenu>
);

const MenuKeluar = () => {
	const { logout, isPending } = useLogout();

	return (
		<MenubarMenu>
			<MenubarTrigger
				className="flex gap-1 text-destructive hover:bg-destructive/10"
				onClick={() => logout()}
				disabled={isPending}
			>
				<IconLogout className="h-4 w-4" />
				<span>{isPending ? "Keluar..." : "Keluar"}</span>
			</MenubarTrigger>
		</MenubarMenu>
	);
};

const TopBarMenu = () => {
	return (
		<Menubar>
			<MenuAplikasi />
			<MenuSettings />
			<MenuKeluar />
		</Menubar>
	);
};

export default TopBarMenu;
