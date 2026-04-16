"use client";

import {
	IconArchive,
	IconBroadcast,
	IconMail,
	IconMailFast,
} from "@tabler/icons-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsCard } from "@/components/dashboard/stats-card";

export default function DashboardPage() {
	// Mock data - replace with real API calls
	const stats = {
		letters: {
			total: 1248,
			incoming: 856,
			outgoing: 392,
		},
		publications: 47,
		quickMessages: 128,
		archives: 2156,
	};

	return (
		<div className="container mx-auto px-4 py-8 text-foreground space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					Dashboard
				</h1>
				<p className="text-sm text-muted-foreground">
					Selamat datang di Smart Office - PERUMDAM TIRTA SATRIA
				</p>
			</div>

			{/* Quick Actions */}
			<QuickActions />

			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Surat Masuk"
					value={stats.letters.incoming.toLocaleString("id-ID")}
					change={{ value: 12.5, type: "increase" }}
					description={`dari ${stats.letters.total.toLocaleString("id-ID")} total`}
					icon={
						<IconMail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
					}
				/>
				<StatsCard
					title="Surat Keluar"
					value={stats.letters.outgoing.toLocaleString("id-ID")}
					change={{ value: 8.2, type: "increase" }}
					description={`dari ${stats.letters.total.toLocaleString("id-ID")} total`}
					icon={
						<IconMailFast className="h-5 w-5 text-purple-600 dark:text-purple-400" />
					}
				/>
				<StatsCard
					title="Publikasi"
					value={stats.publications.toLocaleString("id-ID")}
					change={{ value: 3.1, type: "increase" }}
					description="dokumen aktif"
					icon={
						<IconBroadcast className="h-5 w-5 text-amber-600 dark:text-amber-400" />
					}
				/>
				<StatsCard
					title="Arsip"
					value={stats.archives.toLocaleString("id-ID")}
					change={{ value: 5.4, type: "decrease" }}
					description="dokumen tersimpan"
					icon={
						<IconArchive className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
					}
				/>
			</div>

			{/* Activity Feed */}
			<ActivityFeed />
		</div>
	);
}
