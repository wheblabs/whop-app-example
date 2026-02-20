import Whop from "@whop/sdk";

function createSdk() {
	if (!process.env.WHOP_API_KEY) {
		return null;
	}

	return new Whop({
		apiKey: process.env.WHOP_API_KEY,
		appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
	});
}

export const whopSdk = createSdk();
