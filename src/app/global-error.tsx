"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="id">
			<body className="flex min-h-screen items-center justify-center bg-background text-foreground">
				<div className="mx-auto max-w-md space-y-4 text-center">
					<h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
					<p className="text-muted-foreground">
						Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
					</p>
					{error.digest && (
						<p className="text-xs text-muted-foreground">
							Kode error: {error.digest}
						</p>
					)}
					<Button onClick={reset}>Coba Lagi</Button>
				</div>
			</body>
		</html>
	);
}
