import type { NextConfig } from "next";

// I'm not sure what a lot of this does -- but it might work!
const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/_next/webpack-hmr",
	// 			destination: "https://SPECIFICSUBDOMAIN.vidgenx.com/_next/webpack-hmr",
	// 		},
	// 	];
	// },
	// async headers() {
	// 	return [
	// 		{
	// 			source: "/(.*)",
	// 			headers: [
	// 				{
	// 					key: "X-Frame-Options",
	// 					value: "SAMEORIGIN",
	// 				},
	// 				{
	// 					key: "Content-Security-Policy",
	// 					value: "frame-ancestors 'self' *.vidgenx.com",
	// 				},
	// 			],
	// 		},
	// 		{
	// 			source: "/_next/webpack-hmr",
	// 			headers: [
	// 				{
	// 					key: "Access-Control-Allow-Origin",
	// 					value: "*",
	// 				},
	// 				{
	// 					key: "Access-Control-Allow-Methods",
	// 					value: "GET, OPTIONS",
	// 				},
	// 			],
	// 		},
	// 	];
	// },
};

export default nextConfig;
