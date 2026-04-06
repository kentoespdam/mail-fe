import type { ReactNode } from "react";
import { memo } from "react";
import TopBar from "@/components/dashboard/topbar";

interface TemplateProps {
	children: ReactNode;
}

/**
 * Main application template implementing 60-30-10 color rule:
 * - 60% Dominant: bg-background (neutral foundation)
 * - 30% Secondary: text-muted-foreground, border-border (supporting elements)
 * - 10% Accent: Applied via interactive components (primary, accent)
 */
const Template = memo(({ children }: TemplateProps) => {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<TopBar />
			<main className="flex-1 overflow-y-auto bg-linear-to-b from-background via-muted/10 to-muted/30">
				<div className="container mx-auto px-4 py-8 text-foreground">
					{children}
				</div>
			</main>
		</div>
	);
});

Template.displayName = "Template";

export default Template;
