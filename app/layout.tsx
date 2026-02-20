import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import "frosted-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
	title: "Whop App",
	description: "My Whop App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<WhopApp accentColor="blue" appearance="inherit">
					{children}
				</WhopApp>
			</body>
		</html>
	);
}
