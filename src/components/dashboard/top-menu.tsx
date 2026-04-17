"use client";

import {
	IconArchive,
	IconFileDescription,
	IconFileSearch,
	IconFileSettings,
	IconLayoutDashboard,
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
import { useTopMenu } from "@/hooks/use-top-menu";

const MenuAplikasi = memo(() => {
	const { visibleItems, showArsipSurat, isVisible } = useTopMenu();

	if (!isVisible) return null;

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
