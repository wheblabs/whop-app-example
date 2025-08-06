// Optional Whop API integration
// Only use this if your app needs to integrate with Whop features
// Most simple apps won't need this

import { WhopServerSdk, makeUserTokenVerifier } from "@whop/api";

export const whopApi = WhopServerSdk({
  // Only set these if you need Whop API integration
  appApiKey: process.env.WHOP_API_KEY ?? "fallback",
  onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
});

export const verifyUserToken = makeUserTokenVerifier({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "fallback",
  dontThrow: true,
});
