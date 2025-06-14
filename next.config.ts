import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpackDevMiddleware: config => {
    		config.watchOptions = {
      			poll: 1000,
      			aggregateTimeout: 300,
    		}
    		return config
	},
	logging: {
		fetches: {
			fullUrl: true,
	    		hmrRefreshes: true,
		},
  	},
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
