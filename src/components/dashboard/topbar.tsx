import { GripIcon, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";

const TopBar = () => {
    return (
        <header className="sticky top-0 flex justify-between shrink-0 items-top gap-2 border-b bg-background px-4 pt-1">
            <div>
                <Image
                    loading="eager"
                    src="/eoffice.jpg"
                    alt="logo"
                    width={250}
                    height={52}
                    style={{ width: "auto", height: "auto" }}
                />
            </div>
            <div className="grid justify-items-end">
                <div className="flex gap-2">
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                        </DropdownMenu>
                    </div>
                    <div>Menu</div>
                    <div>
                        <Button variant="destructive">
                            <LogOut size={4} className="size-4" />
                            <span>Keluar</span>
                        </Button>
                    </div>
                </div>
                <div>Bagus Sudrajat</div>
            </div>
        </header>
    );
};

export default TopBar;
