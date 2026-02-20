import { WhopServerSdk } from "@whop/api";

function createSdk() {
	if (!process.env.WHOP_API_KEY || !process.env.NEXT_PUBLIC_WHOP_APP_ID) {
		return null;
	}

	return WhopServerSdk({
		appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
		appApiKey: process.env.WHOP_API_KEY,
		onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
		companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
	});
}

export const whopSdk = createSdk();
