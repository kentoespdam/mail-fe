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
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h1 className="text-2xl font-bold tracking-tight">Master Data</h1>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="w-full grid-cols-3 lg:w-auto lg:grid-cols-none">
					{MASTER_TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="flex items-center gap-2 cursor-pointer"
						>
							<tab.icon className="h-4 w-4" />
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			{children}
		</div>
	);
}
