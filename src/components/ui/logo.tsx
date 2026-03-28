import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
	width?: number;
	height?: number;
	priority?: boolean;
}

/**
 * PDAM Logo component
 * Displays the PDAM logo from public assets
 */
export function Logo({
	className,
	width = 160,
	height = 114,
	priority = false,
}: LogoProps) {
	return (
		<div className={cn("relative inline-flex", className)}>
			<Image
				src="/logo_pdam.svg"
				alt="PDAM Logo"
				width={width}
				height={height}
				priority={priority}
				className="h-auto w-auto object-contain"
			/>
		</div>
	);
}
