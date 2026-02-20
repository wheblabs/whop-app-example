import { whopSdk } from "@/lib/whop-api";
import { headers } from "next/headers";

/**
 * Creates a short-lived access token for Whop Embedded Components.
 * Chat elements, payout elements, etc. call this endpoint to authenticate.
 * Returns 503 if the Whop SDK is not configured (missing env vars).
 */
export async function GET() {
	if (!whopSdk) {
		return Response.json(
			{ error: "Whop SDK not configured. Set WHOP_API_KEY and NEXT_PUBLIC_WHOP_APP_ID." },
			{ status: 503 },
		);
	}

	const headersList = await headers();
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const token = await whopSdk.accessTokens.create({
		userId,
	});

	return Response.json({ token: token.token });
}
