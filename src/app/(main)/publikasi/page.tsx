import { PublicationContent } from "@/components/publication/publication-content";

export const dynamic = "force-dynamic";

export default function PublikasiPage() {
	return (
		<div className="container mx-auto px-4 py-8 text-foreground">
			<PublicationContent />
		</div>
	);
}
