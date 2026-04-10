"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
	const router = useRouter();
	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="max-w-md shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg">Halaman Tidak Ditemukan</CardTitle>
					<CardDescription>
						Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button onClick={() => router.push("/dashboard")}>
						Kembali ke Dashboard
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
