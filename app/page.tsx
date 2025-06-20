"use client";

import styled from "styled-components";

export default function Page() {
	return (
		<Container>
			<Content>
				<Title>
					Welcome to Your App
				</Title>
				<Description>
					This is your main application page. Start building here!
				</Description>
			</Content>
		</Container>
	);
}

const Container = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Content = styled.div`
	text-align: center;
`;

const Title = styled.h1`
	font-size: 2.25rem; /* 36px */
	font-weight: bold;
	color: white;
	margin-bottom: 1rem;
`;

const Description = styled.p`
	font-size: 1.125rem; /* 18px */
	color: #6b7280; /* gray-600 */
`;
