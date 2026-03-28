import type { ReactNode } from "react";
import { Providers } from "@/app/providers";

const Template = ({ children }: { children: ReactNode }) => {
    return <Providers>{children}</Providers>;
};

export default Template;
