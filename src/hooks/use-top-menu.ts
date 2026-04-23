"use client";

import {
	IconBroadcast,
	IconChartHistogram,
	type IconLayoutDashboard,
	IconMail,
	IconSettings2,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { useUser } from "@/hooks/use-user";
import { hasPermission } from "@/lib/rbac";
import type { Permission } from "@/types/auth";

export interface MenuItem {
	label: string;
	href: string;
	icon: typeof IconLayoutDashboard;
	permission: Permission;
}

export function useTopMenu() {
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

	const isVisible = visibleItems.length > 0 || showArsipSurat;

	return {
		visibleItems,
		showArsipSurat,
		isVisible,
	};
}
