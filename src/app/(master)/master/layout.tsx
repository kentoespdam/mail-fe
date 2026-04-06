import type { ReactNode } from "react";
import { memo } from "react";
import TopBar from "@/components/dashboard/topbar";

interface TemplateProps {
	children: ReactNode;
}

/**
 * Master application template - shares the same layout structure as (main):
 * - TopBar with navigation and user profile
 * - Main content area with proper spacing and background
 */
const Template = memo(({ children }: TemplateProps) => {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<TopBar />
			<main className="flex-1 overflow-y-auto bg-linear-to-b from-background to-muted/20">
				<div className="container mx-auto px-4 py-8 text-foreground">
					{children}
				</div>
			</main>
		</div>
	);
});

Template.displayName = "Template";

export default Template;
