import type { ReactNode } from "react";
import { memo } from "react";
import TopBar from "@/components/dashboard/topbar";

interface TemplateProps {
	children: ReactNode;
}

const Template = memo(({ children }: TemplateProps) => {
	return (
		<div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
			<TopBar />
			<main className="flex-1 overflow-auto">
				<div className="container mx-auto px-4 py-6">{children}</div>
			</main>
		</div>
	);
});

Template.displayName = "Template";

export default Template;
