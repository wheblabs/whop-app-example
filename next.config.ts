import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	logging: {
		fetches: {
			fullUrl: true,
	    		hmrRefreshes: true,
		},
  	},
	devIndicators: false,
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization",
					}
				],
			},
			{
				source: "/_next/webpack-hmr",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, OPTIONS",
					},
				],
			},
		];
	},
};

export default nextConfig;
