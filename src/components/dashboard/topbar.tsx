"use client";

import { IconBell } from "@tabler/icons-react";
import { memo } from "react";
import { Providers } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SmartOfficeIcon } from "../ui/smart-office-icon";
import TopBarMenu from "./top-menu";
import UserProfileButton from "./user-profile-button";

/**
 * TopBar component - Modern design following UI/UX best practices:
 * - Clean visual hierarchy with proper spacing and alignment
 * - Accessible interactive elements with focus states
 * - Theme toggle for user preference
 * - Responsive layout with overflow protection
 * - Proper touch targets (min 44px for accessibility)
 */
const TopBar = memo(() => {
	return (
		<header className="sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between border-b border-border bg-background px-4 shadow-sm">
			{/* Left Section: Logo + Navigation */}
			<div className="flex min-w-0 items-center gap-6">
				<SmartOfficeIcon className="shrink-0" />
				<nav className="hidden lg:block">
					<Providers>
						<TopBarMenu />
					</Providers>
				</nav>
			</div>

			{/* Right Section: Actions + User Profile */}
			<div className="flex items-center gap-2">
				{/* Theme Toggle */}
				<ThemeToggle />

				{/* Notifications */}
				<Button
					variant="ghost"
					size="icon"
					className="relative h-10 w-10 shrink-0"
					title="Notifikasi"
					aria-label="Notifikasi"
				>
					<IconBell className="h-5 w-5" />
					<span className="absolute right-2 top-2 flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
						<span className="inline-flex h-2 w-2 rounded-full bg-primary" />
					</span>
				</Button>

				<div className="flex flex-col space-y-1">
					<p className="text-sm font-medium text-right">
						Bagus Sudrajat, S.Kom.
					</p>
					<p className="text-xs text-muted-foreground text-right">
						Administrator
					</p>
				</div>

				{/* Divider */}
				<div className="mx-1 hidden h-7 w-px shrink-0 bg-border sm:block" />

				<UserProfileButton />
			</div>
		</header>
	);
});

TopBar.displayName = "TopBar";

export default TopBar;
