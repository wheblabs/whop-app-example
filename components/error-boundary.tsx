"use client";

import React from "react";
import styled from "styled-components";

export class ErrorBoundary extends React.Component<
	{
		children: React.ReactNode;
	},
	{ errorMessage: string | null }
> {
	constructor(props: {
		children: React.ReactNode;
	}) {
		super(props);
		this.state = { errorMessage: null };
	}

	static getDerivedStateFromError(error: unknown) {
		// Update state so the next render will show the fallback UI.

		if (error instanceof Error) {
			return { errorMessage: error.message };
		}

		return { errorMessage: String(error) };
	}

	componentDidCatch(error: unknown, info: React.ErrorInfo) {
		console.error(error, info);
	}

	render() {
		if (this.state.errorMessage) {
			return <ErrorFallback errorMessage={this.state.errorMessage} />;
		}

		return this.props.children;
	}
}

export function ErrorFallback({ errorMessage }: { errorMessage: string }) {
	return (
		<ErrorContainer>
			Error: {errorMessage}
		</ErrorContainer>
	);
}

const ErrorContainer = styled.div`
	background-color: rgba(239, 68, 68, 0.2); /* red-500/20 */
	color: #ef4444; /* red-500 */
	padding: 0.75rem;
	border-radius: 0.5rem;
`;
