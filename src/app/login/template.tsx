"use client";
import type { ReactNode } from "react";
import { Providers } from "../providers";

const Template = ({ children }: { children: ReactNode }) => {
	return <Providers>{children}</Providers>;
};

export default Template;
