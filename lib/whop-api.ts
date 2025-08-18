// Optional Whop API integration
// Only use this if your app needs to integrate with Whop features
// Most simple apps won't need this

import { WhopServerSdk, makeUserTokenVerifier } from "@whop/api";

if (
  !process.env.WHOP_API_KEY ||
  !process.env.NEXT_PUBLIC_WHOP_APP_ID
) {
  throw new Error(
    "[Whop API] Missing required environment variables: WHOP_API_KEY or NEXT_PUBLIC_WHOP_APP_ID. Please set these in your environment to enable Whop API integration."
  );
}


export const whopSdk = WhopServerSdk({
  // This is the appId of your app. You can find this in the "App Settings" section of your app's Whop dashboard.
  // This is required.
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,

  // Add your app api key here - this is required.
  // You can get this from the Whop dashboard after creating an app in the "API Keys" section.
  appApiKey: process.env.WHOP_API_KEY,

  // This will make api requests on behalf of this user.
  // This is optional, however most api requests need to be made on behalf of a user.
  // You can create an agent user for your app, and use their userId here.
  // You can also apply a different userId later with the `withUser` function.
  onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,

  // This is the companyId that will be used for the api requests.
  // When making api requests that query or mutate data about a company, you need to specify the companyId.
  // This is optional, however if not specified certain requests will fail.
  // This can also be applied later with the `withCompany` function.
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
});

