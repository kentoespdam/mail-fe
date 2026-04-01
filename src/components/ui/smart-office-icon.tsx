import Image from "next/image";
import { cn } from "@/lib/utils";

interface SmartOfficeIconProps {
	className?: string;
	iconSize?: number;
	priority?: boolean;
}

/**
 * Smart Office icon component
 * Displays the Smart Office icon with text (PERUMDAM TIRTA SATRIA - Kab. Banyumas | Smart Office)
 */
export function SmartOfficeIcon({
	className,
	iconSize = 80,
	priority = false,
}: SmartOfficeIconProps) {
	return (
		<div className={cn("relative inline-flex items-center gap-3", className)}>
			<Image
				src="/new-smartoffice-icon-only.svg"
				loading="eager"
				alt="Smart Office Icon"
				width={iconSize}
				height={iconSize}
				priority={priority}
				style={{ width: iconSize, height: iconSize }}
				className="w-auto object-contain"
			/>
			<div className="flex flex-col gap-0.5">
				<span className="text-[18px] font-black tracking-wide text-[#0f172a]">
					PERUMDAM
				</span>
				<span className="text-[19px] font-black tracking-wide text-[#1e3a8a]">
					TIRTA SATRIA
				</span>
				<div className="flex items-center gap-1">
					<span className="text-[11px] font-bold text-[#0284c7]">
						Kab. Banyumas
					</span>
					<span className="text-[11px] font-medium text-[#64748b]">
						| Smart Office
					</span>
				</div>
			</div>
		</div>
	);
}
