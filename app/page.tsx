import { Heading, Text, Spinner } from "@whop/react/components";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<Spinner size="3" />
			<Heading size="4">Building your app...</Heading>
			<Text color="gray" size="2">Describe what you want in the chat</Text>
		</div>
	);
}
