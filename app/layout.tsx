import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhopIframeSdkProvider } from "@whop/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Whop App",
	description: "My Whop App",
};

// Check if we have the required Whop environment variables
const hasWhopConfig = !!(
	process.env.WHOP_API_KEY && 
	process.env.NEXT_PUBLIC_WHOP_APP_ID && 
	process.env.WHOP_API_KEY !== "fallback"
);

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body
				className={`${geistSans.variable} ${geistMono.variable}`}
				style={{ fontSmooth: "antialiased", WebkitFontSmoothing: "antialiased" }}
			>
				{hasWhopConfig ? (
					<WhopIframeSdkProvider>{children}</WhopIframeSdkProvider>
				) : (
					children
				)}
			</body>
		</html>
	);
}
