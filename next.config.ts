import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	reactCompiler: true,
	allowedDevOrigins: ["192.168.230.96"],
};

export default nextConfig;
