import { Heading, Text, Spinner } from "@whop/react/components";

export default function Page() {
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
			<Spinner size="3" />
			<Heading size="4">Building your app...</Heading>
			<Text color="gray" size="2">
				Describe what you want in the chat
			</Text>
		</div>
	);
}
