"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface DeleteConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	title: string;
	confirmText?: string;
	description?: string;
	isPending?: boolean;
	onConfirm: () => void;
}

export function DeleteConfirmDialog({
	open,
	onClose,
	title,
	description,
	isPending,
	onConfirm,
}: DeleteConfirmDialogProps) {
	const effectiveConfirmText = "HAPUS";
	const [input, setInput] = useState("");
	const matches = input === effectiveConfirmText;

	useEffect(() => {
		if (!open) setInput("");
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description ??
							"Tindakan ini tidak dapat dibatalkan."}
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-2">
					<p className="text-sm">
						Ketik <strong>{effectiveConfirmText}</strong> untuk mengonfirmasi
					</p>
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						autoComplete="off"
					/>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						Batal
					</Button>
					<Button
						variant="destructive"
						disabled={!matches || isPending}
						onClick={onConfirm}
					>
						{isPending ? "Menghapus…" : "Hapus"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
