import type { NextConfig } from "next";
import rewrites from "./router/rewrites";

const nextConfig: NextConfig = {
  rewrites: async () => rewrites,
  sassOptions: {
    implementation: 'sass-embedded',
  },
  distDir: '../../dist/frontend',
}

export default nextConfig;
