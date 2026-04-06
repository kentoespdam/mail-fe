import { IconClock } from "@tabler/icons-react";

interface AuditTrailInfoProps {
	updatedAt?: string;
	updatedBy?: string;
}

export function AuditTrailInfo({ updatedAt, updatedBy }: AuditTrailInfoProps) {
	if (!updatedAt && !updatedBy) {
		return null;
	}

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleString("id-ID", {
				day: "2-digit",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateStr;
		}
	};

	return (
		<div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
			<IconClock
				className="size-3.5 shrink-0 text-muted-foreground"
				aria-hidden="true"
			/>
			<span>
				Terakhir diubah: {updatedAt ? formatDate(updatedAt) : "Tidak diketahui"}
				{updatedBy ? ` oleh ${updatedBy}` : ""}
			</span>
		</div>
	);
}
