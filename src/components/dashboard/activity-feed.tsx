"use client";

import {
	IconBroadcast,
	IconFileDescription,
	IconMail,
	IconMailFast,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActivityItem {
	id: string;
	type: "publication" | "letter" | "quick-message" | "announcement";
	title: string;
	description: string;
	timestamp: Date;
}

interface ActivityFeedProps {
	activities?: ActivityItem[];
	isLoading?: boolean;
	className?: string;
}

const activityIcons: Record<ActivityItem["type"], ReactNode> = {
	publication: (
		<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
			<IconBroadcast className="h-4 w-4 text-blue-600 dark:text-blue-400" />
		</div>
	),
	letter: (
		<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
			<IconMail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
		</div>
	),
	"quick-message": (
		<div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
			<IconMailFast className="h-4 w-4 text-amber-600 dark:text-amber-400" />
		</div>
	),
	announcement: (
		<div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
			<IconFileDescription className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
		</div>
	),
};

const mockActivities: ActivityItem[] = [
	{
		id: "1",
		type: "publication",
		title: "Publikasi Dokumen Baru",
		description: "SK Direktur tentang Struktur Organisasi",
		timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
	},
	{
		id: "2",
		type: "letter",
		title: "Surat Masuk",
		description: "Surat dari Dinas Lingkungan Hidup",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
	},
	{
		id: "3",
		type: "quick-message",
		title: "Pesan Singkat",
		description: "Reminder rapat koordinasi hari ini",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
	},
	{
		id: "4",
		type: "announcement",
		title: "Pengumuman",
		description: "Libur nasional tanggal 17 Agustus",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
	},
	{
		id: "5",
		type: "publication",
		title: "Update Dokumen",
		description: "Revisi SOP Pelayanan Pelanggan",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
	},
];

export function ActivityFeed({
	activities = mockActivities,
	isLoading = false,
	className,
}: ActivityFeedProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card shadow-sm",
				className,
			)}
		>
			<div className="border-b border-border/50 bg-muted/30 px-5 py-4">
				<h3 className="text-sm font-semibold tracking-tight text-foreground">
					Aktivitas Terbaru
				</h3>
				<p className="text-xs text-muted-foreground">
					Pantau aktivitas sistem terbaru
				</p>
			</div>

			<div className="divide-y divide-border/50">
				{isLoading && (
					<div className="space-y-3 p-5">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="flex gap-3">
								<div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
								<div className="flex-1 space-y-2">
									<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
									<div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
								</div>
							</div>
						))}
					</div>
				)}

				{!isLoading && activities.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<IconFileDescription className="mb-3 h-10 w-10 text-muted-foreground/50" />
						<p className="text-sm font-medium text-foreground">
							Belum ada aktivitas
						</p>
						<p className="text-xs text-muted-foreground">
							Aktivitas akan muncul di sini
						</p>
					</div>
				)}

				{!isLoading &&
					activities.map((activity, index) => (
						<div
							key={activity.id}
							className={cn(
								"group relative flex gap-3 px-5 py-4 transition-colors hover:bg-muted/30",
								index === 0 && "bg-primary/5",
							)}
						>
							{/* Activity line */}
							{index < activities.length - 1 && (
								<div className="absolute left-8 top-12 h-full w-px bg-border/50" />
							)}

							{/* Icon */}
							<div className="relative z-10">
								{activityIcons[activity.type]}
							</div>

							{/* Content */}
							<div className="flex-1 space-y-1">
								<div className="flex items-start justify-between gap-2">
									<p className="text-sm font-medium text-foreground group-hover:text-primary">
										{activity.title}
									</p>
									<span className="shrink-0 text-xs text-muted-foreground">
										{formatDistanceToNow(activity.timestamp, {
											addSuffix: true,
											locale: id,
										})}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									{activity.description}
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
