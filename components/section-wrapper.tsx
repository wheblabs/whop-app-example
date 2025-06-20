"use client";

import { type PropsWithChildren, Suspense } from "react";
import styled from "styled-components";
import { ErrorBoundary } from "./error-boundary";

export function SectionWrapper({
	children,
	title,
	description,
	index,
}: PropsWithChildren<{ title: string; description: string; index: number }>) {
	return (
		<Container>
			<Header>
				<IndexBadge>
					{index}
				</IndexBadge>
				<Title>{title}</Title>
			</Header>
			<Description>{description}</Description>
			<ErrorBoundary>
				<Suspense fallback={<LoadingFallback />}>{children}</Suspense>
			</ErrorBoundary>
		</Container>
	);
}

function LoadingFallback() {
	return <div>Loading...</div>;
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	border: 1px solid #e5e7eb; /* gray-200 */
	padding: 0.5rem;
	border-radius: 0.5rem;

	@media (prefers-color-scheme: dark) {
		border-color: #374151; /* gray-800 */
	}
`;

const Header = styled.div`
	display: flex;
	gap: 0.5rem;
	align-items: center;
`;

const IndexBadge = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.5rem;
	background-color: #f3f4f6; /* gray-100 */
	color: #374151; /* gray-700 */
	width: 1.75rem; /* 28px */
	height: 1.75rem; /* 28px */
	font-family: monospace;
	font-weight: 800;

	@media (prefers-color-scheme: dark) {
		background-color: #374151; /* gray-800 */
		color: #d1d5db; /* gray-300 */
	}
`;

const Title = styled.h2`
	font-size: 1.5rem;
	font-weight: bold;
`;

const Description = styled.p`
	font-size: 0.875rem;
	color: #6b7280; /* gray-500 */
`;
