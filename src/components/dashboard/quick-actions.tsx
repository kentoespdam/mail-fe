"use client";

import {
	IconBroadcast,
	IconMail,
	IconMailFast,
	IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QuickAction {
	title: string;
	description: string;
	icon: ReactNode;
	href: string;
	color: "blue" | "purple" | "amber" | "emerald";
}

interface QuickActionsProps {
	className?: string;
}

const quickActions: QuickAction[] = [
	{
		title: "Persuratan",
		description: "Kelola surat masuk & keluar",
		icon: <IconMail className="h-5 w-5" />,
		href: "/persuratan",
		color: "blue",
	},
	{
		title: "Publikasi",
		description: "Terbitkan dokumen publik",
		icon: <IconBroadcast className="h-5 w-5" />,
		href: "/publikasi",
		color: "purple",
	},
	{
		title: "Pesan Singkat",
		description: "Kirim pesan internal",
		icon: <IconMailFast className="h-5 w-5" />,
		href: "/master/pesan-singkat",
		color: "amber",
	},
	{
		title: "Pengaturan",
		description: "Konfigurasi sistem",
		icon: <IconSettings className="h-5 w-5" />,
		href: "#",
		color: "emerald",
	},
];

const colorVariants = {
	blue: {
		bg: "bg-blue-500/10",
		text: "text-blue-600 dark:text-blue-400",
		hover: "group-hover:bg-blue-500/20",
		border: "group-hover:border-blue-500/30",
	},
	purple: {
		bg: "bg-purple-500/10",
		text: "text-purple-600 dark:text-purple-400",
		hover: "group-hover:bg-purple-500/20",
		border: "group-hover:border-purple-500/30",
	},
	amber: {
		bg: "bg-amber-500/10",
		text: "text-amber-600 dark:text-amber-400",
		hover: "group-hover:bg-amber-500/20",
		border: "group-hover:border-amber-500/30",
	},
	emerald: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-600 dark:text-emerald-400",
		hover: "group-hover:bg-emerald-500/20",
		border: "group-hover:border-emerald-500/30",
	},
};

export function QuickActions({ className }: QuickActionsProps) {
	return (
		<div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
			{quickActions.map((action) => {
				const colors = colorVariants[action.color];

				return (
					<Link
						key={action.href}
						href={action.href}
						className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
					>
						{/* Gradient accent */}
						<div
							className={cn(
								"absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl transition-all",
								colors.bg,
								colors.hover,
							)}
						/>

						<div className="relative flex items-start gap-3">
							<div
								className={cn(
									"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-transform group-hover:scale-110",
									colors.border,
								)}
							>
								<span className={cn("transition-colors", colors.text)}>
									{action.icon}
								</span>
							</div>

							<div className="flex-1 space-y-1">
								<h4 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary">
									{action.title}
								</h4>
								<p className="text-xs text-muted-foreground">
									{action.description}
								</p>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
