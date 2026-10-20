import type { NextConfig } from "next";

// Built as static files so the site can also live inside the portfolio
// (BASE_PATH=/demos/ganli npm run build).
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH || "",
  trailingSlash: true,
};

export default nextConfig;
