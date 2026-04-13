"use client";

import { IconBell } from "@tabler/icons-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useUser } from "@/hooks/use-user";
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
	const { user, isLoading } = useUser();

	return (
		<header className="sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between border-b border-border bg-secondary px-4 shadow-sm">
			{/* Left Section: Logo */}
			<div className="flex min-w-0 items-center gap-6">
				<SmartOfficeIcon className="shrink-0" />
			</div>

			{/* Right Section: Actions + User Profile */}
			<div className="flex items-center gap-2">
				{/* App Menu */}
				<nav>
					<TopBarMenu />
				</nav>

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
					<IconBell className="size-5 text-secondary-foreground" />
					<span className="absolute right-2 top-2 flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
						<span className="inline-flex h-2 w-2 rounded-full bg-primary" />
					</span>
				</Button>

				<div className="flex flex-col space-y-0.5">
					{isLoading ? (
						<div className="flex flex-col items-end space-y-1">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-2 w-20" />
						</div>
					) : (
						<>
							<p className="text-sm font-semibold text-right text-secondary-foreground">
								{user?.name ?? "—"}
							</p>
							<p className="text-[10px] uppercase tracking-wider font-bold text-secondary-foreground/60 text-right">
								{user?.jabatan ?? "—"}
							</p>
						</>
					)}
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
