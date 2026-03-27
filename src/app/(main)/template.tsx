import type { ReactNode } from "react";
import TopBar from "@/components/dashboard/topbar";

const Template = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-screen h-screen">
            <TopBar />
            {children}
        </div>
    );
};

export default Template;
