import {
	IconKey,
	IconLogout,
	IconSettings,
	IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCallback } from "react";
import { useLogout } from "@/hooks/auth-hooks";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const UserProfileButton = () => {
	const { logout, isPending } = useLogout();

	const handleLogout = useCallback(() => {
		logout();
	}, [logout]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant={"ghost"} size="icon" className="rounded-full" />
				}
			>
				<Avatar className="h-10 w-10 cursor-pointer rounded-full bg-linear-to-br from-primary to-accent text-primary-foreground shadow-md ring-2 ring-transparent transition-all hover:ring-primary/20">
					<AvatarImage src="/user.svg" alt="user" width={30} height={30} />
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem render={<Link href="#" />}>
						<IconUser className="mr-2 h-4 w-4" />
						<span>Profil</span>
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="#" />}>
						<IconKey className="mr-2 h-4 w-4" />
						<span>Ubah Password</span>
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="#" />}>
						<IconSettings className="mr-2 h-4 w-4" />
						<span>Pengaturan</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleLogout}
					disabled={isPending}
					className="text-destructive focus:text-destructive cursor-pointer"
				>
					<IconLogout className="mr-2 h-4 w-4" />
					<span>{isPending ? "Keluar..." : "Keluar"}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserProfileButton;
