"use client";

import styled from "styled-components";
import Image from "next/image";

export default function Page() {
	return (
		<Container>
			<Content>
				<Image src="/whopshop_logo.png" alt="Whop Logo" width={320} height={180} style={{ objectFit: 'contain' }} quality={100} priority />
				<Description>
					This is your main application page. Whopshop will build your app here.
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
	color: #5b5b5b; /* gray-600 */
`;
