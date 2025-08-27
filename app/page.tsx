"use client";

import styled from "styled-components";
import Image from "next/image";

export default function Page() {
	return (
		<Container>
			<Content>
				<Image src="/whopshop_logo.png" alt="Whop Logo" width={360} height={100} style={{ objectFit: 'contain' }} unoptimized={true} priority />
				<Description>
					This is your main application page. Whopshop will build your app here.
				</Description>
			</Content>
		</Container>
	);
}

const Container = styled.div`
	background-color: var(--color-background-primary);
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Content = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Description = styled.p`
	font-size: 1.125rem; /* 18px */
	color: var(--color-text-secondary);
	width: 80%;
`;
