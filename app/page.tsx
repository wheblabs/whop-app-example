"use client";

import styled from "styled-components";
import Image from "next/image";

export default function Page() {
	// Log environment variable to verify it's loaded
	console.log('NEXT_PUBLIC_WHOP_APP_ID:', process.env.NEXT_PUBLIC_WHOP_APP_ID);
	
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
	background-color: #141414;
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

const Title = styled.h1`
	font-size: 2.25rem; /* 36px */
	font-weight: bold;
	color: white;
	margin-bottom: 0.5;
`;

const Description = styled.p`
	font-size: 1.125rem; /* 18px */
	color: #5b5b5b; /* gray-600 */
	width: 80%;
`;
