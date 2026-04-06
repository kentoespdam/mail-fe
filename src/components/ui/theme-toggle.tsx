"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = memo(() => {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8"
				aria-label="Ganti Tema"
			>
				<IconSun className="size-4" aria-hidden="true" />
			</Button>
		);
	}

	const toggleTheme = () => {
		const newTheme = resolvedTheme === "dark" ? "light" : "dark";
		setTheme(newTheme);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8"
			onClick={toggleTheme}
			title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
			aria-label="Ganti Tema"
		>
			{resolvedTheme === "dark" ? (
				<IconSun className="size-4 transition-transform" aria-hidden="true" />
			) : (
				<IconMoon className="size-4 transition-transform" aria-hidden="true" />
			)}
		</Button>
	);
});

ThemeToggle.displayName = "ThemeToggle";
