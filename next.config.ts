import type { NextConfig } from "next";
import { loadEnvConfig } from '@next/env';

// Load environment variables from the system
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Debug log to verify environment variables are loaded
console.log('Next.js Config - Environment Variables:');
console.log('WHOP_API_KEY:', process.env.WHOP_API_KEY ? '[REDACTED]' : 'undefined');
console.log('NEXT_PUBLIC_WHOP_APP_ID:', process.env.NEXT_PUBLIC_WHOP_APP_ID);

const nextConfig: NextConfig = {
	env: {
		WHOP_API_KEY: process.env.WHOP_API_KEY || '',
		NEXT_PUBLIC_WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID || '',
	},
	compiler: {
		styledComponents: true,
	},
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
