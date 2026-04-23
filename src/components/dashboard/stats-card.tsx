"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
	title: string;
	value: string | number;
	change?: {
		value: number;
		type: "increase" | "decrease";
	};
	icon: ReactNode;
	description?: string;
	className?: string;
	isLoading?: boolean;
}

export function StatsCard({
	title,
	value,
	change,
	icon,
	description,
	className,
	isLoading = false,
}: StatsCardProps) {
	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20",
				className,
			)}
		>
			{/* Gradient background accent */}
			<div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-linear-to-br from-primary/5 to-accent/5 blur-2xl transition-all group-hover:from-primary/10 group-hover:to-accent/10" />

			<div className="relative flex items-start justify-between gap-4">
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
						{title}
					</p>

					{isLoading ? (
						<div className="h-8 w-24 animate-pulse rounded bg-muted" />
					) : (
						<p className="text-2xl font-bold tracking-tight text-foreground">
							{value}
						</p>
					)}

					<div className="flex items-center gap-2">
						{change && (
							<span
								className={cn(
									"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
									change.type === "increase"
										? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
										: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
								)}
							>
								{change.type === "increase" ? "↑" : "↓"}{" "}
								{Math.abs(change.value)}%
							</span>
						)}
						{description && (
							<span className="text-xs text-muted-foreground">
								{description}
							</span>
						)}
					</div>
				</div>

				<div
					className={cn(
						"flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm transition-transform group-hover:scale-110",
					)}
				>
					{icon}
				</div>
			</div>
		</div>
	);
}
