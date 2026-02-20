import { whopSdk } from "@/lib/whop-api";
import { headers } from "next/headers";

/**
 * Creates a short-lived access token for Whop Embedded Components.
 * Chat elements, payout elements, etc. call this endpoint to authenticate.
 */
export async function GET() {
	const headersList = await headers();
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const token = await whopSdk.accessTokens.create({
		userId,
	});

	return Response.json({ token: token.token });
}
