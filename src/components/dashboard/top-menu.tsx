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
import { memo, useMemo } from "react";
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
import { useUser } from "@/hooks/use-user";
import { hasPermission } from "@/lib/rbac";
import type { Permission } from "@/types/auth";

interface MenuItem {
	label: string;
	href: string;
	icon: typeof IconLayoutDashboard;
	permission: Permission;
}

const MenuAplikasi = memo(() => {
	const { user } = useUser();

	const menuItems = useMemo<MenuItem[]>(
		() => [
			{
				label: "Dashboard",
				href: "/dashboard",
				icon: IconChartHistogram,
				permission: "menu:dashboard",
			},
			{
				label: "Persuratan",
				href: "/persuratan",
				icon: IconMail,
				permission: "menu:persuratan",
			},
			{
				label: "Publikasi Dokumen",
				href: "/publikasi",
				icon: IconBroadcast,
				permission: "menu:publikasi",
			},
			{
				label: "Master Mail",
				href: "/master/tipe-surat",
				icon: IconSettings2,
				permission: "menu:master",
			},
		],
		[],
	);

	const visibleItems = useMemo(() => {
		if (!user) return [];
		return menuItems.filter((item) =>
			hasPermission(user.roles, item.permission),
		);
	}, [user, menuItems]);

	const showArsipSurat = useMemo(() => {
		if (!user) return false;
		return hasPermission(user.roles, "menu:arsip_surat");
	}, [user]);

	if (visibleItems.length === 0 && !showArsipSurat) return null;

	return (
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
					{visibleItems
						.filter(
							(item) =>
								item.label === "Dashboard" || item.label === "Persuratan",
						)
						.map((item) => (
							<MenubarItem key={item.label} render={<Link href={item.href} />}>
								<item.icon
									className="size-4 text-muted-foreground"
									aria-hidden="true"
								/>
								{item.label}
							</MenubarItem>
						))}
				</MenubarGroup>

				{showArsipSurat && (
					<>
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
					</>
				)}

				<MenubarSeparator />
				<MenubarGroup>
					{visibleItems
						.filter((item) => item.label === "Publikasi Dokumen")
						.map((item) => (
							<MenubarItem key={item.label} render={<Link href={item.href} />}>
								<item.icon
									className="size-4 text-muted-foreground"
									aria-hidden="true"
								/>
								{item.label}
							</MenubarItem>
						))}
				</MenubarGroup>

				{visibleItems.some((item) => item.label === "Master Mail") && (
					<>
						<MenubarSeparator />
						<MenubarGroup>
							{visibleItems
								.filter((item) => item.label === "Master Mail")
								.map((item) => (
									<MenubarItem
										key={item.label}
										render={<Link href={item.href} />}
									>
										<item.icon
											className="size-4 text-muted-foreground"
											aria-hidden="true"
										/>
										{item.label}
									</MenubarItem>
								))}
						</MenubarGroup>
					</>
				)}
			</MenubarContent>
		</MenubarMenu>
	);
});

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
