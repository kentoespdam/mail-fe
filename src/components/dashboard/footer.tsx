import { APP_VERSION } from "@/lib/app-meta";

/**
 * Global application footer component.
 * Displays copyright information and application version.
 * - Follows 60-30-10 color rule: bg-background (60%), text-muted-foreground (30%).
 * - Non-sticky, flow at the end of the content.
 * - Synchronized height via `--footer-height` in globals.css (default: 3rem / 48px).
 */
export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			role="contentinfo"
			className="h-12 border-t border-border bg-background px-4 py-3 md:px-6"
		>
			<div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
				<p className="text-sm tracking-tight text-muted-foreground">
					&copy; Copyright Perumdam Tirta Satria {currentYear}
				</p>
				<span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
					v{APP_VERSION}
				</span>
			</div>
		</footer>
	);
}
