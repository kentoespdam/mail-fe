"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// biome-ignore lint/suspicious/noShadowRestrictedNames: used as a global variable in Next.js Error Component
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] items-center justify-center p-4">
			<Card className="max-w-md shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg">Terjadi Kesalahan</CardTitle>
					<CardDescription>
						Maaf, terjadi kesalahan saat memuat halaman ini.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">{error.message}</p>
					{error.digest && (
						<p className="text-xs text-muted-foreground">
							Kode error: {error.digest}
						</p>
					)}
					<Button onClick={reset}>Coba Lagi</Button>
				</CardContent>
			</Card>
		</div>
	);
}
