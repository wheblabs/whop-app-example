import type { NextConfig } from "next";
import { loadEnvConfig } from '@next/env';

// Load environment variables from the system
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const nextConfig: NextConfig = {
	allowedDevOrigins: ["*"],
	env: {
		WHOP_API_KEY: process.env.WHOP_API_KEY || '',
		NEXT_PUBLIC_WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID || '',
		NEXT_PUBLIC_WHOP_AGENT_USER_ID: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID || '',
		NEXT_PUBLIC_WHOP_COMPANY_ID: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || '',
	},
	compiler: {
		styledComponents: true,
	},
	logging: {
		fetches: {
			fullUrl: false,
		},
	},
	devIndicators: false,
	// Disable verbose HMR logging that causes object dumps
	webpack: (config, { dev }) => {
		if (dev) {
			config.devServer = {
				...config.devServer,
				client: {
					logging: 'warn', // Only show warnings and errors, not verbose info
				},
			};
		}
		return config;
	},
	onDemandEntries: {
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
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
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
		];
	},
	skipTrailingSlashRedirect: true,
};

export default nextConfig;
