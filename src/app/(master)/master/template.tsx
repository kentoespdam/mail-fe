"use client";

import {
	IconCategory,
	IconListLetters,
	IconMailFast,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MASTER_TABS = [
	{
		value: "tipe-surat",
		label: "Tipe Surat",
		path: "/master/tipe-surat",
		icon: IconListLetters,
	},
	{
		value: "kategori-surat",
		label: "Kategori Surat",
		path: "/master/kategori-surat",
		icon: IconCategory,
	},
	{
		value: "pesan-singkat",
		label: "Pesan Singkat",
		path: "/master/pesan-singkat",
		icon: IconMailFast,
	},
];

export default function MasterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const activeTab = MASTER_TABS.find((tab) =>
		pathname.startsWith(tab.path),
	)?.value;

	const handleTabChange = (value: string) => {
		const tab = MASTER_TABS.find((t) => t.value === value);
		if (tab) {
			router.push(tab.path);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			{/* Header Section (30% zone) — Re-styled to Card-based for better elevation */}
			<header className="space-y-6 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
				<div className="flex items-center gap-4">
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Master Data
					</h1>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<TabsList
						variant="line"
						className="w-full justify-start border-none bg-transparent p-0 lg:w-auto"
					>
						{MASTER_TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all text-muted-foreground hover:text-foreground data-active:text-primary cursor-pointer"
							>
								<tab.icon className="size-4" aria-hidden="true" />
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</header>

			{/* Content Area (60% zone) */}
			<main className="px-1">{children}</main>
		</div>
	);
}
