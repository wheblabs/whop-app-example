import { Heading, Text, Spinner } from "@whop/react/components";

export default function Page() {
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "16px" }}>
			<Spinner size="3" />
			<Heading size="4">Building your app...</Heading>
			<Text color="gray" size="2">Just a moment</Text>
		</div>
	);
}
