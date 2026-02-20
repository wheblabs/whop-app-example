"use client";

import { Heading, Text, Spinner } from "@whop/react/components";
import styled from "styled-components";

const Center = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	gap: 16px;
`;

export default function Page() {
	return (
		<Center>
			<Spinner size="3" />
			<Heading size="4">Building your app...</Heading>
			<Text color="gray" size="2">
				Describe what you want in the chat
			</Text>
		</Center>
	);
}
