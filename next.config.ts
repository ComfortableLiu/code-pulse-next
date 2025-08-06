import type { NextConfig } from "next";
import rewrites from "@router/rewrites";

const nextConfig: NextConfig = {
  rewrites: async () => rewrites,
  sassOptions: {
    implementation: 'sass-embedded',
  },
}

export default nextConfig;
