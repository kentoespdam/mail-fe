"use client";

import Image from "next/image";
import type * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
}

function Avatar({ className, children, ...props }: AvatarProps) {
	return (
		<div
			data-slot="avatar"
			className={cn(
				"relative flex size-8 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

interface AvatarImageProps extends React.ComponentProps<typeof Image> {}

function AvatarImage({ className, ...props }: AvatarImageProps) {
	return (
		<Image
			data-slot="avatar-image"
			className={cn("aspect-square size-full object-cover", className)}
			{...props}
		/>
	);
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
	return (
		<span
			data-slot="avatar-fallback"
			className={cn(
				"flex size-full items-center justify-center rounded-full bg-muted text-[0.625rem] font-medium",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
