"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipButtonProps extends ButtonProps {
	tooltip: string;
	side?: "top" | "bottom" | "left" | "right";
}

/**
 * A reusable button component with a tooltip.
 * Handles disabled state by wrapping in a span to ensure the tooltip still shows.
 */
export function TooltipButton({
	tooltip,
	side = "top",
	children,
	disabled,
	...buttonProps
}: TooltipButtonProps) {
	const button = (
		<Button disabled={disabled} {...buttonProps}>
			{children}
		</Button>
	);

	return (
		<Tooltip>
			<TooltipTrigger render={disabled ? <span>{button}</span> : button} />
			<TooltipContent side={side}>{tooltip}</TooltipContent>
		</Tooltip>
	);
}
