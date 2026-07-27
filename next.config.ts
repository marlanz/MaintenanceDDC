import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    typedEnv: true, //type safe for env variables
    browserDebugInfoInTerminal: true, //show client side log in terminal
  },
};

export default nextConfig;
