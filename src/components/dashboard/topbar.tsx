import { IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "../ui/button";
import TopBarMenu from "./top-menu";

const TopBar = () => {
    return (
        <header className="sticky top-0 flex justify-between shrink-0 gap-2 border-b bg-background px-4 pt-1">
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
            <div className="grid justify-items-end gap-1">
                <TopBarMenu />
                <Button>
                    <IconUser />
                    Bagus Sudrajat
                </Button>
            </div>
        </header>
    );
};

export default TopBar;
