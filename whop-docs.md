# Official Whop SDK Documentation

This file contains the complete official Whop SDK documentation from https://dev.whop.com/llms-full.txt

**To update this documentation:**
1. Go to https://dev.whop.com/llms-full.txt
2. Copy the entire content
3. Replace everything below this header

---
# Docs for your LLM
Source: https://dev.whop.com/ai-docs

Learn how to build with AI using Whop's APIs.

Our docs are available in a text format. You can use this to feed your LLM with the docs.

[https://dev.whop.com/llms-full.txt](https://dev.whop.com/llms-full.txt)


# Authentication
Source: https://dev.whop.com/api-reference/graphql/authentication

An overview of authentication methods for the Whop API

All calls on Whop are made on behalf of a user, and a company ID if applicable, as followed below.

<CodeGroup>
  ```javascript get-user.ts
  export const whopApi = WhopApi({
    appApiKey: process.env.WHOP_API_KEY,
    onBehalfOfUserId: "YOUR_USER_OR_AN_AGENT_USER",
    companyId: undefined,
  });

  // fetch another user

  await whopApi.FetchPublicUser({ userId: winningUser });
  ```
</CodeGroup>

You are able to make calls on behalf of any user using your app.


# Examples
Source: https://dev.whop.com/api-reference/graphql/examples



Here are some useful queries and their implementations to get you started in Next.JS, Swift, or Python:

### Get messages from a direct message feed

```graphql
query DmsFeedData($feedId: ID!, $postsLimit: Int!) {
  dmsFeedData(feedId: $feedId, postsLimit: $postsLimit) {
    posts {
      content
      user {
        username
        id
      }
    }
  }
}
```

### Get current user information

```graphql
query myCurrentUser {
  viewer {
    user {
      id
      username
      name
      email
    }
  }
}
```

### Send chat message

```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input)
}
```

### Create a forum post

```graphql
mutation CreateForumPost($input: CreateForumPostInput!) {
  createForumPost(input: $input) {
    # You can specify return fields here if needed
  }
}
```

### Get whops from discover

```graphql
query DiscoverySearch($query: String!) {
  discoverySearch(query: $query) {
    accessPasses {
      title
      route
      headline
      logo {
        sourceUrl
      }
    }
  }
}
```

## Implementation Examples

### Python (using requests)

```python
import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "x-on-behalf-of": "user_123",
    "x-company-id": "biz_123",
    "Content-Type": "application/json"
}

# Example: Fetching DMs
full_query = """query DmsFeedData($feedId: ID!, $postsLimit: Int!) {
    dmsFeedData(feedId: $feedId, postsLimit: $postsLimit) {
        posts {
            content
            user {
                username
                id
            }
        }
    }
}"""

payload = {
    "query": full_query,
    "variables": {
        "feedId": "your_feed_id",
        "postsLimit": 1
    }
}

response = requests.post(
    "https://api.whop.com/public-graphql",
    headers=headers,
    json=payload
)
response_json = response.json()
```

### Next.js (using Apollo Client)

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { gql } from "@apollo/client";

// Create HTTP link
const httpLink = createHttpLink({
  uri: "https://api.whop.com/public-graphql",
});

// Add auth headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer YOUR_API_KEY`,
      "x-on-behalf-of": "user_123",
      "x-company-id": "biz_123",
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Example: Discovery Search
const DISCOVERY_SEARCH = gql`
  query DiscoverySearch($query: String!) {
    discoverySearch(query: $query) {
      accessPasses {
        title
        route
        headline
        logo {
          sourceUrl
        }
      }
    }
  }
`;

// Usage
client
  .query({
    query: DISCOVERY_SEARCH,
    variables: { query: "search_term" },
  })
  .then((result) => console.log(result));
```

### Swift (using Apollo iOS)

```swift
import Apollo

// Configure Apollo Client
let url = URL(string: "https://api.whop.com/public-graphql")!

let store = ApolloStore()
let transport = RequestChainNetworkTransport(
    interceptorProvider: DefaultInterceptorProvider(store: store),
    endpointURL: url,
    additionalHeaders: [
        "Authorization": "Bearer YOUR_API_KEY",
        "x-on-behalf-of": "user_123",
        "x-company-id": "biz_123"
    ]
)

let client = ApolloClient(networkTransport: transport, store: store)

// Example: Get Current User
let getCurrentUser = """
query myCurrentUser {
  viewer {
    user {
      id
      username
      name
      email
    }
  }
}
"""

client.fetch(query: getCurrentUser) { result in
    switch result {
    case .success(let graphQLResult):
        print("Success! Result: \(graphQLResult)")
    case .failure(let error):
        print("Failure! Error: \(error)")
    }
}
```

These examples demonstrate basic usage of the Whop GraphQL API across different platforms. Remember to replace placeholder values (YOUR\_API\_KEY, user\_123, etc.) with your actual credentials.


# Rate Limits
Source: https://dev.whop.com/api-reference/graphql/rate-limits



## Overview

The Whop GraphQL API enforces rate limits to ensure fair usage and system stability.

## Current Limits

```http
10 requests per 10 seconds
```

## Query Complexity Limits

In addition to request rate limits, the GraphQL API enforces query complexity limits:

* **Max Complexity**: 1000
* **Max Depth**: 10

These limits help prevent overly complex or deeply nested queries that could impact performance.
If you encounter these errors, you'll need to break your requests into smaller queries.

Learn more about query complexity and depth here: [https://www.howtographql.com/advanced/4-security/](https://www.howtographql.com/advanced/4-security/)

## Handling Rate Limits

If you exceed the rate limit, the API will respond with a `429 Too Many Requests` status code.
When this happens, it's best to wait until the rate limit window resets before making additional requests.

## Best Practices

* Implement exponential backoff for retries
* Cache responses when possible
* Batch GraphQL operations into fewer requests


# Schema
Source: https://dev.whop.com/api-reference/graphql/schema



## Why GraphQL

GraphQL is an API interface (alternative to REST) that allows for rapid development and iterative changes to evolving objects.
Whop has built its core product and internal APIs using GraphQL for years, and is now exposing most of the same functionality
via a publicly accessible version.

## Available endpoints

You can explore all available queries and mutations using our Apollo OS explorer:

🔗 [GraphQL Explorer](https://studio.apollographql.com/public/whop-public-gql/variant/current/explorer)

To make a call, you must pass the following headers:

```http
Authorization: Bearer YOUR_APP_API_KEY
x-on-behalf-of: user_1NqS34mOp24
x-company-id: biz_Nq4S34mfp59
Content-Type: application/json
```

| Header           | Description                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `Authorization`  | Get from [here](/what-to-build/agentic-businesses#step-1%3A-create-your-app). Must be prefixed with "Bearer". |
| `x-on-behalf-of` | Specifies the User ID of the account you're making requests on behalf of.                                     |
| `x-company-id`   | Specifies the Biz ID to target the business of a user you are calling from.                                   |
| `Content-Type`   | Specifies the format of the request payload as JSON.                                                          |

#### Who can you make requests on behalf of?

Your app can make calls on behalf of users in three ways. Any of these methods grant full access to automating the user's account:

* The User is the original creator of the organization in which your app was created (Ex. your own User ID)
* The User is an Agent User created by the app [here](/what-to-build/agentic-businesses#step-1%3A-create-your-app)
* The User has joined a whop that has installed your app

## API Capabilities

This GraphQL API provides **powerful** access to the entire Whop ecosystem, allowing developers to build sophisticated integrations and applications. Through the API, you can access and manipulate all core Whop functionality, including:

* User management
* Store and product handling
* Messages, forum posts, and live streams

## Development Status

> ⚠️ **Important Note**: This API is still under active development.

While we strive to maintain backward compatibility, some features may be added, modified, or removed

We recommend checking our changelog regularly for updates and announcements about API changes.


# Scopes
Source: https://dev.whop.com/api-reference/graphql/scopes

An overview of authorization scopes for the Whop API

When calling the Whop API on behalf of a user or a company you need to first obtain permissions to do so.

Obtain permission by either:

* **embedded apps** - setting your required scopes in your app's settings in the [Whop dashboard](https://whop.com/dashboard/developer/)
* **standalone apps** - using the `scopes` parameter when using [Whop OAuth](/features/oauth-guide)

<Note>
  Once you have obtained permissions you can use your app's API key to make
  calls on behalf of the user or company.
</Note>

## Available scopes

* `read_user`: Read the user's basic details. This scope is required and will be automatically granted when users open embedded apps.


# Building Apps
Source: https://dev.whop.com/building-apps

Learn how to build and structure apps on Whop with experience and discover views

Whop apps are composed of **views** - different pages you build into your app that users interact with. Understanding these views is essential for creating a complete app experience.

## App Views

Your app consists of two main types of views:

### Experience Views

An **experience** is an instance of your app when someone installs it into their Whop. Think of it as a unique deployment of your app for a specific community or business. The **experience view** is what users see when they install your app into their Whop and click into it. This is the core functionality of your app - where users interact with your features and services.

* **Route**: Typically `/experiences/[experienceId]`
* **Access**: Private, gated through the Whop SDK
* **Purpose**: Deliver the main app functionality to authorized users

### Discover Views

The **discover view** is a new public-facing view that helps potential users explore what your app offers. This view showcases your app's capabilities and highlights success stories from other communities.

* **Route**: Public page accessible to anyone
* **Access**: No authentication required
* **Purpose**: Marketing and discovery, showcasing app value and success stories

#### Linking to Whops & Showcasing Success

To further promote your app and earn affiliate fees, consider linking to other Whops that use your app and have seen success. You can do this by adding links on your discover view to the Whop's discover page at `/discover/{accessPassRoute}/`, appending your app's ID as a query parameter: `?app={yourAppId}`. For example:

```
/discover/{accessPassRoute}/?app={yourAppId}
```

This not only helps potential users see real-world examples of your app in action, but also allows you to earn affiliate commissions for any referrals.

> **How to get the access pass route:**
> You can use the [Whop SDK](/sdk/api/experiences/list-access-passes-for-experience) to find the `accessPass_route` by experience ID. This will return the access passes for that experience, including the route you can use for linking.

<Callout type="warning">
  When building discover views, include a **64px margin** on your top-level content to prevent it from being hidden by the iframe header.
</Callout>

## Building Experience Views

Our template projects come preconfigured with Whop authentication logic, so you can guarantee users have proper access and retrieve the appropriate IDs and permissions before performing app logic.

If your app requires storing data in an external database,  can use these IDs to properly scope data to the correct experiences and user IDs:

* **Experience ID**: Scope data to specific app installations
* **User ID**: Associate data with individual users

## Monetization with Discover Views

You can collect affiliate fees by linking out to Whops from your discover page. Simply append the query parameter \`?app={yourAppId} to Whop links to track referrals and earn commissions.

## Testing Your App Locally

To test your app during development:

1. Go to [whop.com](https://whop.com) and install your app
2. Navigate to your app details page
3. Set your local paths and environment variables
4. Then click on your app in the sidebar
5. You should see a dev toggle option in the top right. Click on this set the environment to local to preview your local app as you develop,
6. You can switch between experience and discover views to test both interfaces
7. When you are ready to publish, make sure your app base url is set, and you are good to go.

This allows you to develop and test your app locally while maintaining the full Whop integration experience.

## Next Steps

<CardGroup cols={2}>
  <Card title="SDK Reference" href="/sdk" icon="code" color="#16a34a">
    Explore available SDK functions for your app
  </Card>

  <Card title="App Overview" href="/apps/overview" icon="circle-info" color="#16a34a">
    Learn more about how apps fit into the Whop ecosystem
  </Card>

  <Card title="Tutorials" href="/tutorials" icon="book-open" color="#16a34a">
    Step-by-step guides for common app patterns
  </Card>
</CardGroup>


# Embed checkout (Public Beta)
Source: https://dev.whop.com/features/checkout-embed

Learn how to embed Whop's checkout flow on your website

Embedded checkout allows you to embed Whop's checkout flow on your own website in two easy steps. This allows you to offer your users a seamless checkout experience without leaving your website.

## React

### Step 1: Install the package

```bash
npm install @whop/react
```

### Step 2: Add the checkout element

```tsx
import { WhopCheckoutEmbed } from "@whop/react/checkout";

export default function Home() {
  return <WhopCheckoutEmbed planId="plan_XXXXXXXXX" />;
}
```

This component will now mount an iframe with the Whop checkout embed. Once the checkout is complete, the user will be redirected to the redirect url you specified in the settings on Whop.

You can configure the redirect url in your [whop's settings](https://whop.com/dashboard/whops/) or in your [company's settings](https://whop.com/dashboard/settings/checkout/) on the dashboard. If both are specified, the redirect url specified in the whop's settings will take precedence.

### Available controls

To get access to the controls of the checkout embed, you can use the `ref` prop.

```tsx
const ref = useCheckoutEmbedControls();

return <WhopCheckoutEmbed ref={ref} planId="plan_XXXXXXXXX" />;
```

#### **`submit`**

To submit checkout programmatically, you can use the `submit` method on the checkout element.

```tsx
ref.current?.submit();
```

### Available properties

#### **`planId`**

**Required** - The plan id you want to checkout.

#### **`theme`**

**Optional** - The theme you want to use for the checkout.

Possible values are `light`, `dark` or `system`.

#### **`sessionId`**

**Optional** - The session id to use for the checkout.

This can be used to attach metadata to a checkout by first creating a session through the API and then passing the session id to the checkout element.

#### **`hidePrice`**

**Optional** - Turn on to hide the price in the embedded checkout form.

Defaults to `false`

#### **`hideTermsAndConditions`**

**Optional** - Set to `true` to hide the terms and conditions in the embedded checkout form.

Defaults to `false`

#### **`skipRedirect`**

**Optional** - Set to `true` to skip the final redirect and keep the top frame loaded.

Defaults to `false`

#### **`onComplete`**

**Optional** - A callback function that will be called when the checkout is complete.

<Note>This option will set `skipRedirect` to `true`</Note>

```tsx
<WhopCheckoutEmbed
  onComplete={(planId, receiptId) => {
    console.log(planId, receiptId);
  }}
  planId="plan_XXXXXXXXX"
/>
```

#### **`utm`**

**Optional** - The UTM parameters to add to the checkout URL.

**Note** - The keys must start with `utm_`

```tsx
<WhopCheckoutEmbed
  planId="plan_XXXXXXXXX"
  utm={{ utm_campaign: "ad_XXXXXXX" }}
/>
```

#### **`fallback`**

**Optional** - The fallback content to show while the checkout is loading.

```tsx
<WhopCheckoutEmbed fallback={<>loading...</>} planId="plan_XXXXXXXXX" />
```

#### **`prefill`**

**Optional** - The prefill options to apply to the checkout embed.

Used to prefill the email in the embedded checkout form.
This setting can be helpful when integrating the embed into a funnel that collects the email prior to payment already.

```tsx
<WhopCheckoutEmbed
  prefill={{ email: "example@domain.com" }}
  planId="plan_XXXXXXXXX"
/>
```

### Full example

```tsx
import { WhopCheckoutEmbed } from "@whop/react/checkout";

export default function Home() {
  return (
    <WhopCheckoutEmbed
      fallback={<>loading...</>}
      planId="plan_XXXXXXXXX"
      theme="light"
      hidePrice={false}
      sessionId="ch_XXXXXXXXX"
    />
  );
}
```

## Other websites

### Step 1: Add the script tag

To embed checkout, you need to add the following script tag into the `<head>` of your page:

```md
<script
  async
  defer
  src="https://js.whop.com/static/checkout/loader.js"
></script>
```

### Step 2: Add the checkout element

To create a checkout element, you need to include the following attribute on an element in your page:

```md
<div data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

This will now mount an iframe inside of the element with the plan id you provided. Once the checkout is complete, the user will be redirected to the redirect url you specified in the settings on Whop.

You can configure the redirect url in your [whop's settings](https://whop.com/dashboard/whops/) or in your [company's settings](https://whop.com/dashboard/settings/checkout/) on the dashboard. If both are specified, the redirect url specified in the whop's settings will take precedence.

### Available methods

#### **`submit`**

To submit checkout programmatically, you can use the `submit` method on the checkout element.
First, attach an `id` to the checkout container:

```md
<div id="whop-embedded-checkout" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

Then, you can submit the checkout by calling `wco.submit` with the id:

```js
wco.submit("whop-embedded-checkout");
```

### Available attributes

#### **`data-whop-checkout-plan-id`**

**Required** - The plan id you want to checkout.

> To get your plan id, you need to first create a plan in the **Manage Pricing** section on your whop page.

#### **`data-whop-checkout-theme`**

**Optional** - The theme you want to use for the checkout.

Possible values are `light`, `dark` or `system`.

```md
<div data-whop-checkout-theme="light" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-theme-accent-color`**

**Optional** - The accent color to apply to the checkout embed

Possible values are

* `tomato`
* `red`
* `ruby`
* `crimson`
* `pink`
* `plum`
* `purple`
* `violet`
* `iris`
* `cyan`
* `teal`
* `jade`
* `green`
* `grass`
* `brown`
* `blue`
* `orange`
* `indigo`
* `sky`
* `mint`
* `yellow`
* `amber`
* `lime`
* `lemon`
* `magenta`
* `gold`
* `bronze`
* `gray`

```md
<div data-whop-checkout-theme-accent-color="green" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-session`**

**Optional** - The session id to use for the checkout.

This can be used to attach metadata to a checkout by first creating a session through the API and then passing the session id to the checkout element.

```md
<div data-whop-checkout-session="ch_XXXXXXXXX" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-hide-price`**

**Optional** - Set to `true` to hide the price in the embedded checkout form.

Defaults to `false`

```md
<div data-whop-checkout-hide-price="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-hide-submit-button`**

**Optional** - Set to `true` to hide the submit button in the embedded checkout form.

Defaults to `false`

<Note>
  When using this Option, you will need to [programmatically submit](#submit)
  the checkout form.
</Note>

```md
<div data-whop-checkout-hide-submit-button="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-hide-tos`**

**Optional** - Set to `true` to hide the terms and conditions in the embedded checkout form.

Defaults to `false`

```md
<div data-whop-checkout-hide-tos="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-skip-redirect`**

**Optional** - Set to `true` to skip the final redirect and keep the top frame loaded.

Defaults to `false`

```md
<div data-whop-checkout-skip-redirect="true" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

#### **`data-whop-checkout-on-complete`**

**Optional** - The callback to call when the checkout succeeds

<Note>This option will set `data-whop-checkout-skip-redirect` to `true`</Note>

```html
<script>
  window.onCheckoutComplete = (planId, receiptId) => {
    console.log(planId, receiptId);
  };
</script>

<div
  data-whop-checkout-on-complete="onCheckoutComplete"
  data-whop-checkout-plan-id="plan_XXXXXXXXX"
></div>
```

#### **`data-whop-checkout-on-state-change`**

**Optional** - The callback to call when state of the checkout changes

This can be used when programmatically controlling the submit of the checkout embed.

```html
<script>
  window.onCheckoutStateChange = (state) => {
    console.log(state);
  };
</script>

<div
  data-whop-checkout-on-state-change="onCheckoutStateChange"
  data-whop-checkout-plan-id="plan_XXXXXXXXX"
></div>
```

#### **`data-whop-checkout-skip-utm`**

By default any utm params from the main page will be forwarded to the checkout embed.

**Optional** - Set to `true` to prevent the automatic forwarding of utm parameters

Defaults to `false`

#### **`data-whop-checkout-prefill-email`**

Used to prefill the email in the embedded checkout form. This setting can be helpful when integrating the embed into a funnel that collects the email prior to payment already.

```md
<div data-whop-checkout-prefill-email="example@domain.com" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
```

### Full example

```md
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<script
			async
			defer
  			src="https://js.whop.com/static/checkout/loader.js"
		></script>
		<title>Whop embedded checkout example</title>
		<style>
			div {
				box-sizing: border-box;
			}
			body {
				margin: 0
			}
		</style>
	</head>
	<body>
		<div
			data-whop-checkout-plan-id="plan_XXXXXXXXX"
			data-whop-checkout-session="ch_XXXXXXXXX"
			data-whop-checkout-theme="light"
			data-whop-checkout-hide-price="false"
			style="height: fit-content; overflow: hidden; max-width: 50%;"
		></div>
	</body>
</html>
```


# Login with Whop
Source: https://dev.whop.com/features/oauth-guide

Learn how to implement Whop OAuth in a stand-alone application.

## Intro

Use Whop OAuth to authenticate users in your web or iOS app.

<Note>
  This guide only covers the basic steps to implement Whop OAuth and does not cover best practices regarding the OAuth2 protocol. It is recommended to use a library to handle the OAuth2 flow.

  We are going to release a guide on how to implement Whop OAuth with auth.js soon.
</Note>

### Step 1: Create a Whop App and obtain secrets

1. Go to the [Whop Dashboard](https://whop.com/dashboard/developer/) and create a new app or select an existing one.

2. Add a redirect uri in your apps OAuth settings

   To test your app locally you can add a redirect uri on `http://localhost:{PORT}` but it is recommended to use https for production.

3. Copy the app id and api key and set them in your environment variables.

   Keep in mind that the api key is a secret and should not be shared with anyone. The app id is public and can be shared with anyone.

   ```.env
   NEXT_PUBLIC_WHOP_APP_ID=your-app-id
   WHOP_API_KEY=your-api-key
   ```

### Step 2: Initiate the OAuth flow

#### Setup the OAuth flow

To follow this guide you will need to install the `@whop/api` package from npm:

<CodeGroup>
  ```bash pnpm
  pnpm i @whop/api
  ```

  ```bash npm
  npm i @whop/api
  ```

  ```bash yarn
  yarn add @whop/api
  ```
</CodeGroup>

Start off by creating a route that will be hit by the user when they click the `Login with Whop` button:

```ts /api/oauth/init/route.ts
import { WhopServerSdk } from "@whop/api";

const whopApi = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY!,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
});

export function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/home";

  const { url, state } = whopApi.oauth.getAuthorizationUrl({
    // This has to be defined in the redirect uris outlined in step 1.2
    redirectUri: "http://localhost:3000/api/oauth/callback",
    // These are the authorization scopes you want to request from the user.
    scope: ["read_user"],
  });

  // The state is used to restore the `next` parameter after the user lands on the callback route.
  // Note: This is not a secure way to store the state and for demonstration purposes only.
  return Response.redirect(url, {
    headers: {
      "Set-Cookie": `oauth-state.${state}=${encodeURIComponent(
        next
      )}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    },
  });
}
```

<Note>
  Read more about available scopes [here](/api-reference/graphql/scopes).
</Note>

#### Adding the `Login with Whop` button

Now continue by adding a link to your app that will initiate the `Login with Whop` flow:

```html
<a href="/api/oauth/init?next=/home">Login with Whop</a>
```

Upon clicking the link the user will be redirected to the Whop OAuth page and is prompted to authorize your app.

### Step 3: Exchange the code for a token

Upon successful authorization the user will be redirected to the redirect uri you specified in the query parameters with `code` and `state` query parameters:

```ts /api/oauth/callback/route.ts
import { WhopServerSdk } from "@whop/api";

const whopApi = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY!,
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
});

export function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    // redirect to error page
    return Response.redirect("/oauth/error?error=missing_code");
  }

  if (!state) {
    // redirect to error page
    return Response.redirect("/oauth/error?error=missing_state");
  }

  const stateCookie = request.headers
    .get("Cookie")
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith(`oauth-state.${state}=`));

  if (!stateCookie) {
    // redirect to error page
    return Response.redirect("/oauth/error?error=invalid_state");
  }

  // exchange the code for a token
  const authResponse = await whopApi.oauth.exchangeCode({
    code,
    redirectUri: "http://localhost:3000/api/oauth/callback",
  });

  if (!authResponse.ok) {
    return Response.redirect("/oauth/error?error=code_exchange_failed");
  }

  const { access_token } = authResponse.tokens;

  // Restore the `next` parameter from the state cookie set in the previous step.
  const next = decodeURIComponent(stateCookie.split("=")[1]);
  const nextUrl = new URL(next, "http://localhost:3000");

  // This is an example, you should not store the plain user auth token in a cookie in production.

  // After setting the cookie you can now identify the user by reading the cookie when the user visits your website.
  return Response.redirect(nextUrl.toString(), {
    headers: {
      "Set-Cookie": `whop_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    },
  });
}
```

## Implementing with authentication frameworks

### Auth.js

To implement Whop OAuth with auth.js you can use the `authJsProvider` method on the `WhopOAuth` class.

Get started by setting up the relevant auth.js distribution:

* Next.js ([Installation Guide](https://authjs.dev/getting-started/installation?framework=Next.js)) via `next-auth@beta`
* SvelteKit ([Installation Guide](https://authjs.dev/getting-started/installation?framework=SvelteKit)) via `@auth/sveltekit`
* Qwik ([Installation Guide](https://authjs.dev/getting-started/installation?framework=Qwik)) via `@auth/qwik`
* Express ([Installation Guide](https://authjs.dev/getting-started/installation?framework=Express)) via `@auth/express`

Create a Whop OAuth provider and add it to your auth.js provider configuration:

```ts
const WhopProvider = whopApi.oauth.authJsProvider({
  scope: ["read_user"],
});

const authConfig = {
  providers: [WhopProvider],
  // ... rest of your auth.js configuration
};
```


# Payments and payouts
Source: https://dev.whop.com/features/payments-and-payouts

Use the API to collect payment from users or payout users.

## Collecting Payments

First, create the charge on the server using the Whop API. Then you can either:

1. Open a modal in your app using the iframe SDK (recommended)
2. Redirect the user to Whop's checkout page

### 1. Create the charge on the server

> This step will create a charge on the server and return the inAppPurchase object required for the next step.

On the server, use the [chargeUser](/sdk/api/payments/charge-user) method to create a charge:

```typescript app/api/charge/route.ts
import { whopSdk } from "@/lib/whop-sdk";

export async function POST(request: Request) {
  try {
    const { userId, experienceId } = await request.json();

    const result = await whopSdk.payments.chargeUser({
      amount: 100,
      currency: "usd",
      userId: userId,
      // metadata is information that you'd like to receive later about the payment.
      metadata: {
        creditsToPurchase: 1,
        experienceId: experienceId,
      },
    });

    if (!result?.inAppPurchase) {
      throw new Error("Failed to create charge");
    }

    return Response.json(result.inAppPurchase);
  } catch (error) {
    console.error("Error creating charge:", error);
    return Response.json({ error: "Failed to create charge" }, { status: 500 });
  }
}
```

### 2. Confirm the payment on the client

> In this step the user will be prompted to confirm the previously created charge in a modal.

<Warning>
  This function requires the iFrame SDK to be initialized. See [**iFrame
  Overview**](/sdk/iframe-setup) for more information.
</Warning>

Use the iframe SDK to open a payment modal:

<CodeGroup>
  ```tsx React
  "use client";
  import { useIframeSdk } from "@whop/react";

  export default function PaymentButton({
    userId,
    experienceId,
  }: {
    userId: string;
    experienceId: string;
  }) {
    const iframeSdk = useIframeSdk();
    
    const [receiptId, setReceiptId] = useState<string>();
    const [error, setError] = useState<string>();
    
    async function handlePurchase() {
      try {
        // 1. Create charge on server
        const response = await fetch("/api/charge", {
          method: "POST",
          body: JSON.stringify({ userId, experienceId }),
        });
        
        if (response.ok) {
          const inAppPurchase = await response.json();
          // 2. Open payment modal
          const res = await iframeSdk.inAppPurchase(inAppPurchase);
          
          if (res.status === "ok") {
            setReceiptId(res.data.receipt_id);
            setError(undefined);
          } else {
            setReceiptId(undefined);
            setError(res.error);
          }
        } else {
          throw new Error("Failed to create charge");
        }
      } catch (error) {
        console.error("Purchase failed:", error);
        setError("Purchase failed");
      }
    }
    
    return <button onClick={handlePurchase}>Purchase Plan</button>;
  }
  ```

  ```tsx Vanilla JS
  import { iframeSdk } from "@/lib/iframe-sdk";

  const paymentButton = document.querySelector("button#payment-button");
  const receiptElement = document.querySelector("span#receiptContainer");
  const errorElement = document.querySelector("span#errorContainer");

  function setError(error?: string) {
    if (errorElement instanceof HTMLSpanElement) {
      errorElement.textContent = error ?? "";
    }
  }

  function setReceiptId(receiptId?: string) {
    if (receiptElement instanceof HTMLSpanElement) {
      receiptElement.textContent = receiptId ?? "";
    }
  }

  if (paymentButton instanceof HTMLButtonElement) {
    paymentButton.addEventListener(
      "click",
      async function onPaymentButtonClick() {
        const userId = this.dataset.userId;
        const experienceId = this.dataset.experienceId;
        if (!userId || !experienceId) {
          throw new Error("Missing userId or experienceId");
        }

        try {
          // 1. Create charge on server
          const response = await fetch("/api/charge", {
            method: "POST",
            body: JSON.stringify({ userId, experienceId }),
          });

          if (response.ok) {
            const inAppPurchase = await response.json();
            // 2. Open payment modal
            const res = await iframeSdk.inAppPurchase(inAppPurchase);

            if (res.status === "ok") {
              setReceiptId(res.data.receipt_id);
              setError(undefined);
            } else {
              setReceiptId(undefined);
              setError(res.error);
            }
          } else {
            throw new Error("Failed to create charge");
          }
        } catch (error) {
          console.error("Purchase failed:", error);
          setError("Purchase failed");
        }
      }
    );
  }
  ```
</CodeGroup>

## Sending Payouts

You can send payouts to any user using their Whop username. The funds will be transferred from your company's ledger account.

### Transfer Funds

```typescript
import { whopSdk } from "@/lib/whop-sdk";

async function sendPayout(
  companyId: string,
  recipientUsername: string,
  amount: number
) {
  // 1. Get your company's ledger account
  const experience = await whopSdk.experiences.getExperience({ experienceId });
  const companyId = experience.company.id;
  const ledgerAccount = await whopSdk.companies.getCompanyLedgerAccount({
    companyId,
  });

  // 2. Pay the recipient
  await whopSdk.payments.payUser({
    amount: amount,
    currency: "usd",
    // Username or ID or ledger account ID of the recipient user
    destinationId: recipientUsername,
    // Your company's ledger account ID that can be retrieve from whopSdk.companies.getCompanyLedgerAccount()
    ledgerAccountId: ledgerAccount.company?.ledgerAccount.id!,
    // Optional transfer fee in percentage
    transferFee: ledgerAccount.company?.ledgerAccount.transferFee,
  });
}
```


# Create forum post
Source: https://dev.whop.com/features/post-to-feed

Create a forum and a post using the API

## Overview

To post in a forum, you must:

1. Find or create a *Forum Experience*
2. Create a *Forum Post* inside the *Forum Experience*

<Info>
  If you already know what forum experience you want to post in, you can skip
  step 1, and use the experience ID directly in step 2.
</Info>

***

## Find or create a forum experience

A forum post must be created within a **Forum Experience**.
The `findOrCreateForum` method will find an existing forum experience with the specified name,
or create a new one with all the specified options

```typescript
const newForum = await whopSdk
  .withUser("YOUR_AGENT_USER_ID")
  .forums.findOrCreateForum({
    experienceId: experienceId,
    name: "Dino game results",
    whoCanPost: "admins",
    // optional:
    // expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    // price: {
    // baseCurrency: "usd",
    // initialPrice: 100,
    // }
  });
```

> This will create the forum in the same whop as the supplied experience.

***

## Create a forum post.

Once you have the `experienceId` from the above, use it to create a post.

### Basic Forum Post

```ts
const forumPost = await whopSdk
  .withUser("YOUR_AGENT_USER_ID")
  .forums.createForumPost({
    forumExperienceId: newForum.createForum?.id,
    title: "Welcome!",
    content: "Excited to kick things off in our new forum 🎉",
  });
```

* `withUser()`: ID of the user posting
* `forumExperienceId`: The ID of the target forum
* `title` and `content`: Main post body. *(title is optional)*

### Forum post with advanced options

This demonstrates a rich post using all features:

```ts
const forumPost = await whopSdk
  .withUser("YOUR_AGENT_USER_ID")
  .forums.createForumPost({
    forumExperienceId: "exp_XXXXXX",
    // Visible even before purchase.
    title: "Big Launch + Community Poll!",
    // Visible only after purchase
    content: "Hidden content unless purchased. 🔒",
    // Add media to the post.
    // Learn how to upload in the upload-media section
    attachments: [
      {
        directUploadId: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
      },
    ],

    // Do not send a notification to everyone about this post.
    isMention: false,

    // Lock the content and attachments behind a
    // one time purchase in the price + currency.
    paywallAmount: 9.99,
    paywallCurrency: "usd",

    // Add a poll to the post.
    poll: {
      options: [
        { id: "1", text: "New Product Features" },
        { id: "2", text: "Exclusive AMA" },
        { id: "3", text: "Member Giveaways" },
      ],
    },
  });
```


# Send push notification
Source: https://dev.whop.com/features/send-push-notification

Send a push notification to a user or a group of users.

## Send a notification to everyone in an experience.

<Info>
  Make sure you have [setup your whop SDK client on the
  server](/sdk/whop-api-client)
</Info>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

// This could be a server action / api route that create a
// piece of content in your app for this experience
export async function createSomeContentInExperience(
  experienceId: string,
  content: string, // this could be a more complex type depending on your specific app.
  createdByUserId: string
) {
  // Create the content in your app.
  // ... await some database call etc etc...

  // Send a push notification to everyone in the experience.
  await whopSdk.notifications.sendPushNotification({
    title: "New content is available" /* Required! */,
    content: content.slice(0, 100) + "...", // Format the content as you wish.
    experienceId, // send to all users with access to this experience.

    isMention: false, // Set this to true to make everyone immediately
    // get a mobile push notification.

    senderUserId: createdByUserId, // This will render this user's
    // profile picture as the notification image.
  });
}
```

See the full list of accepted parameters [here](/sdk/api/notifications/send-push-notification).

## Adding a deeplink to the notification.

When you send a notification, you will usually want to send the user to specific section in your app upon clicking the notification.
You can do this by using the `restPath` property.

1. Update your app path in the dashboard to handle the additional parameters.

   In the hosting section, set the "App path" field to something like: `/experiences/[experienceId]/[restPath]`

2. In your `sendPushNotification` call, add the `restPath` property.

   ```typescript
   await whopSdk.notifications.sendPushNotification({
     title: "New content is available",
     content: content.slice(0, 100) + "...",
     experienceId,
     restPath: `/posts/${somePostId}`, // The specific posts route is just an example
     // You could also just add a query param like this:
     // restPath: `?id=${specialId}`,
   });
   ```

3. Update you app to handle the following route:

   When clicking on a notification, the user will open this specific url on your app within the whop iframe.

   ```
   https://your-domain.com/experiences/exp_123/posts/post_123
   ```

   If using NextJS, you can add a `page.tsx` file with the path: `app/experiences/[experienceId]/posts/[postId]/page.tsx`

   <Info>
     Note: the exact path will depend on the pathname structure you set in the
     `restPath` property.
   </Info>

## Sending a notification to company admins

Your app may want to alert company admins only, not all members. Use the `companyTeamId` field instead of the `experienceId` when sending the notification.

```typescript
await whopSdk.notifications.sendPushNotification({
  title: "A member just posted a new listing. Review it now.",
  content: `${listingTitle}`,
  companyTeamId,
});
```

<Info>
  You must send either the `companyTeamId` or the `experienceId` when sending a
  notification. Setting both will result in an error.
</Info>

## Sending a notification to a specific subset of users.

Use the `userIds` field to filter the users who will receive the notification.

Whop will first apply either the `experienceId` or the `companyTeamId` filter and then apply the `userIds` filter

Ensure that the `userIds` array contains valid user IDs that are part of the specified experience or company team.

For example if you a building a bidding app you may want to alert the highest bidder if they were just outbid.

```typescript
await whopSdk.notifications.sendPushNotification({
  title: "You were just outbid",
  content: `${listingTitle}`,
  experienceId, // the experience ID that the current item is listed within.
  userIds: [oldHighestBidderUserId],
});
```


# Subscriptions
Source: https://dev.whop.com/features/subscriptions

Gate your app behind a subscription or one-time purchase

## Setup your access pass on the dashboard.

1. Go to the your [app's dashboard](https://whop.com/dashboard/developer).
2. Select the access passes tab and create an access pass. Give it a name like "My App Premium"
3. Create a pricing plan for the access pass by clicking the "Add Pricing" button from the table row.
4. After creating the pricing plan, copy the plan id from the 3 dot menu in the pricing plan card.
5. Also copy the access pass id from the 3 dot menu in the access pass table row.

<Info>
  We recommend storing the access pass id and plan id in environment variables
  for your app. Eg:

  ```bash
  NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID="prod_XXXXXXXX"
  NEXT_PUBLIC_PREMIUM_PLAN_ID="plan_XXXXXXXX"
  ```
</Info>

## Check if users have access

When a user makes a request to your app, you can easily check if they have access using the whop api.

```typescript
const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass({
  accessPassId: process.env.NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID, // from step 5 above.
  userId: userId,
});
```

If a user does not have access, you can [prompt them to purchase](#collect-payment-from-users) or show a lite "free" version of the app to upsell them.

## Collect payment from users

<Warning>
  This function requires the iFrame SDK to be initialized. See [**iFrame
  Overview**](/sdk/iframe-setup) for more information.
</Warning>

Use the iframe sdk to collect payment from users. This will show a whop native payment modal in which the user can confirm their purchase.

<CodeGroup>
  ```tsx React
  "use client";
  import { useIframeSdk } from "@whop/react";

  export default function GetAccessButton() {
    const iframeSdk = useIframeSdk();
    
    const [receiptId, setReceiptId] = useState<string>();
    const [error, setError] = useState<string>();
    
    async function handlePurchase() {
      try {
  		const res = await iframeSdk.inAppPurchase({ planId: process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID });
  		
  		if (res.status === "ok") {
  			setReceiptId(res.data.receipt_id);
  			setError(undefined);
  		} else {
  			setReceiptId(undefined);
  			setError(res.error);
  		}
      } catch (error) {
        console.error("Purchase failed:", error);
        setError("Purchase failed");
      }
    }
    
    return <button onClick={handlePurchase}>Get Access</button>;
  }
  ```

  ```tsx Vanilla JS
  import { iframeSdk } from "@/lib/iframe-sdk";

  const getAccessButton = document.querySelector("button#get-access-button");
  const receiptElement = document.querySelector("span#receiptContainer");
  const errorElement = document.querySelector("span#errorContainer");

  function setError(error?: string) {
    if (errorElement instanceof HTMLSpanElement) {
      errorElement.textContent = error ?? "";
    }
  }

  function setReceiptId(receiptId?: string) {
    if (receiptElement instanceof HTMLSpanElement) {
      receiptElement.textContent = receiptId ?? "";
    }
  }

  if (getAccessButton instanceof HTMLButtonElement) {
    getAccessButton.addEventListener(
      "click",
      async function onGetAccessButtonClick() {
        try {
          const res = await iframeSdk.inAppPurchase({
            planId: process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID,
          });

          if (res.status === "ok") {
            setReceiptId(res.data.receipt_id);
            setError(undefined);
          } else {
            setReceiptId(undefined);
            setError(res.error);
          }
        } catch (error) {
          console.error("Purchase failed:", error);
          setError("Purchase failed");
        }
      }
    );
  }
  ```
</CodeGroup>

# Attaching custom metadata to a subscription

You can attach custom metadata to a subscription by using the `createCheckoutSession` mutation.

For example, you can use this to associate a subscription with an experience or company that it was created for.
Using this you can attribute the source of the subscription and build powerful revenue sharing features into your app.

Before using the `iframeSdk.inAppPurchase` function, you need to create a checkout session, and pass it to the function.

### Create the checkout session in a server action.

Use the whopSdk to create a checkout session on your backend, pass the experienceId to this function.

```typescript
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export async function createSubscription(experienceId: string) {
  const { userId } = await whopSdk.verifyUserToken(await headers());

  // Check to make sure the current user has access to the experience.
  const hasAccess = await whopSdk.access.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  const checkoutSession = await whopSdk.payments.createCheckoutSession({
    planId: process.env.NEXT_PUBLIC_PREMIUM_PLAN_ID,
    metadata: {
      experienceId,
    },
  });

  return checkoutSession;
}
```

### Pass the checkout session to the iframeSdk.inAppPurchase function.

```tsx React
"use client";

import { useIframeSdk } from "@whop/react";
import { createSubscription } from "@/lib/actions/create-subscription";

export default function GetAccessButton({
  experienceId,
}: {
  experienceId: string;
}) {
  const iframeSdk = useIframeSdk();

  const [receiptId, setReceiptId] = useState<string>();
  const [error, setError] = useState<string>();

  async function handlePurchase() {
    try {
      const inAppPurchase = await createSubscription(experienceId);
      const res = await iframeSdk.inAppPurchase(inAppPurchase);

      if (res.status === "ok") {
        setReceiptId(res.data.receipt_id);
        setError(undefined);
      } else {
        setReceiptId(undefined);
        setError(res.error);
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      setError("Purchase failed");
    }
  }

  return <button onClick={handlePurchase}>Get Access</button>;
}
```

This custom metadata will be available in the webhook payloads sent to your server (if enabled).

You can use the `payUser` mutation to share your subscription revenue with the creator of the experience.


# Upload media
Source: https://dev.whop.com/features/upload-media

Use Whop to upload images, videos, audio, and other files.

### Client-Side: Set up the Image Upload Component

First, create a component to handle image uploads. This example uses `react-dropzone` for the file upload interface.

```typescript
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function ImageUploader() {
  // Set up state for the image file and preview
  const [image, setImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    const objectUrl = image?.preview;
    if (objectUrl) {
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [image?.preview]);

  // Handle file drops
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8">
      <input {...getInputProps()} />
      {image?.preview ? (
        <img src={image.preview} alt="Preview" className="max-w-full h-auto" />
      ) : (
        <p>Drag & drop an image here, or click to select</p>
      )}
    </div>
  );
}
```

### Server-Side: Handle File Uploads

Create an API route to handle the file upload using the Whop SDK:

```typescript
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);
    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the file from the request
    const file = await request.blob();

    // Upload to Whop
    const response = await whopSdk.attachments.uploadAttachment({
      file: new File([file], `upload-${Date.now()}.png`, {
        type: "image/png",
      }),
      record: "forum_post", // or other record types
    });

    // The response includes the directUploadId and URL
    return NextResponse.json({
      success: true,
      attachmentId: response.directUploadId,
      url: response.attachment.source.url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
```

### Using Uploaded Media

After uploading, you can use the attachment ID in various Whop features. For example, to create a forum post with the uploaded image (server-side):

```typescript
const createForumPost = async (attachmentId: string) => {
  const post = await whopSdk.forums.createForumPost({
    forumExperienceId: "your-forum-id",
    content: "Check out this image!",
    attachments: [{ directUploadId: attachmentId }],
  });

  return post;
};
```

### Supported File Types

The Whop API supports the following file types for upload:

* Images: `.jpg`, `.jpeg`, `.png`, `.gif`
* Videos: `.mp4`, `.mov`
* Documents: `.pdf`

### Best Practices

1. **File Size**: Keep uploads under 100MB for optimal performance
2. **Image Optimization**: Consider using libraries like `sharp` for image processing before upload
3. **Error Handling**: Implement proper error handling on both client and server
4. **Clean Up**: Remember to clean up any preview URLs to prevent memory leaks
5. **Security**: Always verify user authentication before handling uploads
6. **Progress Tracking**: Consider implementing upload progress tracking for better UX

### Complete Example

Here's a complete example showing both client and server integration:

```typescript
// app/components/MediaUploader.tsx (Client)
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function MediaUploader() {
  const [image, setImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!image?.file) return;

    setIsUploading(true);
    try {
      // Send to your API route
      const formData = new FormData();
      formData.append("file", image.file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Clear the form after successful upload
      setImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8"
      >
        <input {...getInputProps()} />
        {image?.preview ? (
          <img
            src={image.preview}
            alt="Preview"
            className="max-w-full h-auto"
          />
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>

      {image && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
}
```

This implementation provides a complete media upload solution with:

* Drag and drop interface
* File preview
* Upload handling
* Progress states
* Error handling
* Automatic cleanup


# Webhooks
Source: https://dev.whop.com/features/webhooks

Use webhooks to get notified when specific events happen relating to your app.

Access your webhooks from the app detail screen in your [dashboard](https://whop.com/dashboard/developer/).


# Connect to websocket
Source: https://dev.whop.com/features/websocket-guide

Learn how to implement real-time features using Whop's websocket API

You can connect to the websocket from your client side frontend code running in the iFrame.

## Client Setup

### React

When using react, it is recommended to use the `WhopWebsocketProvider` provider from the `@whop/react` package to connect to the websocket.

1. Mount the `WhopWebsocketProvider` provider:

   ```tsx app/layout.tsx
   import { WhopWebsocketProvider } from "@whop/react";
   import { handleAppMessage } from "@/lib/handle-websocket-message";

   export default function Layout({ children }: { children: React.ReactNode }) {
     return (
       <WhopWebsocketProvider
         // optional, you can join a specific experience channel (ie, the one you are currently viewing).
         joinExperience="exp_XXXX"
         // optional, you can join a custom channel.
         joinCustom="some_custom_channel"
         // optional, a callback that is called when an app message is received. you can also use the `useOnWebsocketMessage` hook to handle messages.
         onAppMessage={handleAppMessage}
       >
         {children}
       </WhopWebsocketProvider>
     );
   }
   ```

2. Handle app messages:

   ```tsx lib/handle-websocket-message.tsx
   export function handleAppMessage(message: proto.common.AppMessage) {
     console.log("Received app message:", message);

     // message.isTrusted is true if and only if the message was sent from your server with your private app API key.

     // message.json is the JSON string you sent from your server / client.

     // if you sent the message from the client using websocket.broadcast,
     // message.fromUserId will include the user id of the user who sent the message.
   }

   // You can also handle messages using the `useOnWebsocketMessage` hook.
   export function MyNestedReactComponent() {
     const [state, setState] = useState<string>("");
     useOnWebsocketMessage((message) => {
       setState(message.json);
     });
     return <div>{state}</div>;
   }
   ```

3. Handle connection status changes:

   ```tsx
   import { useWebsocketStatus } from "@whop/react";

   // inside of a component
   const connectionStatus = useWebsocketStatus();
   ```

### Other frameworks

Alternatively, you can create the websocket client using the `@whop/api` package in any framework.

1. Create the websocket client:

   ```typescript
   import { WhopClientSdk } from "@whop/api";

   const whopApi = WhopClientSdk();

   const websocket = whopApi.websocketClient({
     joinExperience: "exp_XXXX", // optional, you can join a specific experience channel (ie, the one you are currently viewing).
     joinCustom: "some_custom_channel", // optional, you can join a custom channel.
   });
   ```

2. Add event handlers for messages:

   ```typescript
   websocket.on("appMessage", (message) => {
     console.log("Received custom message:", message);

     // message.isTrusted is true if and only if the message was sent from your server with your private app API key.

     // message.json is the JSON string you sent from your server / client.

     // if you sent the message from the client using websocket.broadcast,
     // message.fromUserId will include the user id of the user who sent the message.
   });
   ```

3. Handle connection status changes:

   ```typescript
   websocket.on("connectionStatus", (status) => {
     console.log("Websocket Status Updated:", status);
   });

   websocket.on("connect", () => {
     console.log("Websocket Connected");
   });

   websocket.on("disconnect", () => {
     console.log("Websocket Disconnected");
   });
   ```

4. Connect to the websocket and start receiving events:

   ```typescript
   websocket.connect();
   ```

5. *Optional:* Disconnect from the websocket:

   ```typescript
   websocket.disconnect();
   ```

## Send messages from the client

You can send messages from the client to the server by using the `websocket.broadcast` or `useBroadcastWebsocketMessage` function.

1. Create a websocket client as above.

2. Send a custom message via websocket.

<CodeGroup>
  ```tsx React
  import { useBroadcastWebsocketMessage } from "@whop/react";

  export function SendMessageExample() {
    const broadcast = useBroadcastWebsocketMessage();

    function sendMessage () {
       broadcast({
          message: JSON.stringify({ hello: "world" }),
          target: "everyone",
       });
    }

    return <button onClick={sendMessage}>Send Message</button>
  }

  ```

  ```typescript Other frameworks
  // make sure you are connected by calling `websocket.connect()`

  websocket.broadcast({
    message: JSON.stringify({ hello: "world" }),
    target: "everyone",
  });
  ```
</CodeGroup>

<Note>
  The target field is the same as the one you would pass to
  `whopApi.sendWebsocketMessage` on the server.
</Note>

## Send messages from your server

You can broadcast trusted websocket messages from your server to connected clients by using the `whopApi.sendWebsocketMessage` function.

1. Construct an instance of the whop server sdk and pass your API key:

   ```typescript
   import { WhopServerSdk } from "@whop/api";

   const whopApi = WhopServerSdk({
     appApiKey: process.env.WHOP_API_KEY,
   });
   ```

2. Send a custom string message via websocket.

   ```typescript
   // Send to all users currently on your app across all experiences / views.
   whopApi.sendWebsocketMessage({
     message: JSON.stringify({ hello: "world" }),
     target: "everyone",
   });

   // send to all users currently on this experience
   // (only works if the experience belongs to your app)
   whopApi.sendWebsocketMessage({
     message: JSON.stringify({ hello: "world" }),
     target: { experience: "exp_XXXX" },
   });

   // create a custom channel that your websocket client can subscribe to.
   // Only works if when connecting on the client, you pass the same custom channel name.
   whopApi.sendWebsocketMessage({
     message: JSON.stringify({ hello: "world" }),
     target: { custom: "some_custom_channel" },
   });

   // send to a specific user on your app
   whopApi.sendWebsocketMessage({
     message: JSON.stringify({ hello: "world" }),
     target: { user: "user_XXXX" },
   });
   ```

## Receive messages on your server

<Info>
  Before you start, make sure you are using NodeJS 22.4 or higher, or Bun to run
  your server.
</Info>

Use the server websocket API to receive events such as chat messages as forum posts for a particular user on your server.
You can use these events to build real-time apps such as chat bots and AI-agents that react to events on the platform.

1. Construct (or reuse) an instance of the whop server sdk and pass your API key:

   ```typescript
   import { WhopServerSdk } from "@whop/api";

   const whopApi = WhopServerSdk({
     appApiKey: process.env.WHOP_API_KEY,
   });
   ```

2. Create your websocket client and add handlers for messages / status changes:

   ```typescript
   const websocket = whopApi
     // Pass the user id of the user you want to receive events for
     .withUser("user_v9KUoZvTGp6ID")
     // Construct the websocket client
     .websocketClient();
   ```

3. Add event handlers for messages:

   ```typescript
   websocket.on("message", (message) => {
     console.log("Received Message:", message);

     const chatMessage = message.feedEntity?.dmsPost;
     if (chatMessage) {
       // handle the chat message
     }

     const forumPost = message.feedEntity?.forumPost;
     if (forumPost) {
       // handle the forum post
     }
   });
   ```

4. Add event handlers for status changes (same as client API):

   ```typescript
   websocket.on("connectionStatus", (status) => {
     console.log("Websocket Status Updated:", status);
   });

   // Or you can also listen to the connect and disconnect events:
   websocket.on("connect", () => {
     console.log("Websocket Connected");
   });

   websocket.on("disconnect", () => {
     console.log("Websocket Disconnected");
   });
   ```

5. Connect to the websocket and start receiving events:

   ```typescript
   websocket.connect();
   ```

6. *Optional:* Disconnect from the websocket:

   ```typescript
   websocket.disconnect();
   ```


# Get an API key
Source: https://dev.whop.com/get-api-key

All requests to Whop APIs are managed using a secure API key.

1. Go to [https://whop.com/dashboard/developer/](https://whop.com/dashboard/developer/).
2. Click the Create App button.
3. Give your app a name and click the Create button.
4. Copy the API key from the `Environment variables` section and use it in your code.

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/whop/how-to-videos/how-to-make-app-and-get-keys.gif" alt="How to create an app and get API keys" />
</Frame>

### Company API (deprecated) -- V2 and V5

Legacy. Old system for when you want to automate your own creator account or sync payments/crm data to your internal systems.


# Getting started
Source: https://dev.whop.com/getting-started



1. Clone our Next.js app template:

   <CodeGroup>
     ```bash Next.js
     npx create-next-app@latest whop-app -e https://github.com/whopio/whop-nextjs-app-template
     ```
   </CodeGroup>

2. Install packages:

   <CodeGroup>
     ```bash pnpm
     pnpm i
     ```

     ```bash npm
     npm i
     ```

     ```bash yarn
     yarn i
     ```
   </CodeGroup>

3. Run the app locally:

   <CodeGroup>
     ```bash pnpm
     pnpm dev
     ```

     ```bash npm
     npm run dev
     ```

     ```bash yarn
     yarn dev
     ```
   </CodeGroup>

Now open [http://localhost:3000](http://localhost:3000) and follow the directions on the page.

<CardGroup cols={2}>
  <Card title="View our tutorials" href="/tutorials" icon="book-open" color="#16a34a">
    Step-by-step guides to help you get started building with Whop.
  </Card>

  <Card title="SDK Reference" href="/sdk" icon="code" color="#16a34a">
    View available functions from our API to make calls in your app.
  </Card>
</CardGroup>


# Introduction
Source: https://dev.whop.com/introduction

Build Whop apps and sell them into Whop communities with thousands of members.

# What are Whop Apps?

A Whop app is a web app that can be embedded into a whop community. These apps can be installed by any Whop creator through our [app store](https://whop.com/discover/app-store/). As the developer, you can charge for the app using several options offered by our Whop SDK. Our Whop SDK makes it easy to leverage the infrastructure of whop, to build full-blown apps in hours, not weeks.

# Examples of apps

* [AI image generator](https://whop.com/apps/app_KHqcozSfEGNyhl/install/)
* [Pay-to-play game](https://whop.com/apps/app_scKdeUGhiBtYPr/install/)
* [Chat bot](https://whop.com/apps/app_3rqpGo1tsmPDHg/install/)
* [AI car customizer](https://whop.com/apps/app_S42iB0COVVUVwO/install/)

# Why build Whop apps?

## Distribution

You will be placed in the Whop App Store. The app store is visited by tens of thousands of creators who are looking to offer more value to their communities. You focus on building the best app you can, and we will handle getting you customers.

## Authentication

Zero authentication required. Since your app is embedded into a whop, we handle all user authentication for you. You have access to a load of user information via the Whop SDK.

## Payments

Tap into the power of Whop's payment system. Accept payment with extremely low effort.

### Explore how to collect payments

<AccordionGroup>
  <Accordion title="Transaction fees">
    Enable in-app purchases and take a transaction fee on each sale. For example, selling game credits, running a watch marketplace, or letting creators sell custom t-shirts.
  </Accordion>

  <Accordion title="Installation fee">
    Charge a one-time installation fee of \$5000 and let Whop creators offer your app as a free benefit for joining their community.
  </Accordion>

  <Accordion title="Per seat">
    Charge \$1 per member inside of a whop and let creators offer your app as a free benefit for joining their community
  </Accordion>

  <Accordion title="Monthly subscription">
    Charge Whop creators \$300 per month to let their members use your app freely.
  </Accordion>

  <Accordion title="Affiliate commission">
    Let whop creators sell your app inside their community for \$29/month and earn a referral fee for every customer they bring you.
  </Accordion>
</AccordionGroup>

## Get started

<CardGroup cols={2}>
  {" "}

  <Card title="View our tutorials" href="/tutorials" icon="book-open" color="#16a34a">
    Step-by-step guides to help you get started building with Whop.
  </Card>

  <Card title="Clone our starter template" href="/getting-started" icon="code" color="#16a34a">
    Clone our starter template to get started building your app.
  </Card>

  <Card title="Watch a tutorial" href="https://www.youtube.com/watch?v=-zKMt3a8GJ4" icon="video" color="#16a34a" img="https://i.ytimg.com/vi/-zKMt3a8GJ4/maxresdefault.jpg">
    Watch an end to end tutorial on how to build a Whop app with Next.js.
  </Card>
</CardGroup>


# Install our MCP
Source: https://dev.whop.com/mcp

Learn how to install our MCP.

You can install our MCP by runnning this command:

```bash
npx mint-mcp add whop
```

This provides you with a ready-to-use MCP server with knowledge of our docs.


# Get Access Pass
Source: https://dev.whop.com/sdk/api/access-passes/get-access-pass

Fetches an access pass based on the ID or the route

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.accessPasses.getAccessPass({
	// The ID or route of the access pass to fetch.
	accessPassId: "prod_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The internal ID of the public access pass.
	id: "xxxxxxxxxxx",

	// The title of the access pass. Use for Whop 4.0.
	title: "some string",

	// A short description of what the company offers or does.
	shortenedDescription: "some string",

	// Whether this product is Whop verified.
	verified: true,

	// This access pass will/will not be displayed publicly.
	visibility:
		"archived" /* Valid values: archived | hidden | quick_link | visible */,

	// The route of the access pass.
	route: "some string",

	// The number of active users for this access pass.
	activeUsersCount: 10,

	// The logo for the access pass.
	logo: {
		// The original URL of the attachment, such as a direct link to S3. This should
		// never be displayed on the client and always passed to an Imgproxy transformer.
		sourceUrl: "some string",
	},

	// The banner image for the access pass.
	bannerImage: {
		// The original URL of the attachment, such as a direct link to S3. This should
		// never be displayed on the client and always passed to an Imgproxy transformer.
		sourceUrl: "some string",
	},

	// The headline of the access pass.
	headline: "some string",

	// A short type of the company that this access pass belongs to.
	company: {
		// The ID (tag) of the company.
		id: "xxxxxxxxxxx",

		// The title of the company.
		title: "some string",
	},

	// The average of all reviews for this access pass.
	reviewsAverage: 10,

	// The user that owns the access pass (company owner).
	ownerUser: {
		// The internal ID of the user.
		id: "xxxxxxxxxxx",

		// The name of the user from their Whop account.
		name: "some string",

		// The username of the user from their Whop account.
		username: "some string",

		// The user's profile picture
		profilePicture: {
			// The original URL of the attachment, such as a direct link to S3. This should
			// never be displayed on the client and always passed to an Imgproxy transformer.
			sourceUrl: "some string",
		},

		// Whether or not the user's phone is verified
		phoneVerified: true,

		// The city the user is from.
		city: "some string",

		// The country the user is from.
		country: "some string",
	},

	// The attachments for the access pass.
	galleryImages: {
		// A list of nodes.
		nodes: [
			{
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},
		],
	},
};

```


# Check If User Has Access To Access Pass
Source: https://dev.whop.com/sdk/api/access/check-if-user-has-access-to-access-pass

Check if the user has access to a Whop resource

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.access.checkIfUserHasAccessToAccessPass({
	// The ID of the access pass
	accessPassId: "prod_XXXXXXXX" /* Required! */,

	// The ID of the user
	userId: "user_XXXXXXXX",
});

```

Example output:

```typescript
const response = {
	// Whether the user has access to the resource
	hasAccess: true,

	// The permission level of the user
	accessLevel: "admin" /* Valid values: admin | customer | no_access */,
};

```


# Check If User Has Access To Company
Source: https://dev.whop.com/sdk/api/access/check-if-user-has-access-to-company

Check if the user has access to a Whop resource

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.access.checkIfUserHasAccessToCompany({
	// The ID of the company
	companyId: "biz_XXXXXXXX" /* Required! */,

	// The ID of the user
	userId: "user_XXXXXXXX",
});

```

Example output:

```typescript
const response = {
	// Whether the user has access to the resource
	hasAccess: true,

	// The permission level of the user
	accessLevel: "admin" /* Valid values: admin | customer | no_access */,
};

```


# Check If User Has Access To Experience
Source: https://dev.whop.com/sdk/api/access/check-if-user-has-access-to-experience

Check if the user has access to a Whop resource

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.access.checkIfUserHasAccessToExperience({
	// The ID of the experience
	experienceId: "exp_XXXXXXXX" /* Required! */,

	// The ID of the user
	userId: "user_XXXXXXXX",
});

```

Example output:

```typescript
const response = {
	// Whether the user has access to the resource
	hasAccess: true,

	// The permission level of the user
	accessLevel: "admin" /* Valid values: admin | customer | no_access */,
};

```


# Create App Build
Source: https://dev.whop.com/sdk/api/apps/create-app-build



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.apps.createAppBuild({
	// Attachment input for the app build file. This should be an upload in .zip
	// format. The zip should contain at least one main_js_bundle.hbc file and
	// optionally an assets folder next to it.
	attachment: {
		// This ID should be used the first time you upload an attachment. It is the ID
		// of the direct upload that was created when uploading the file to S3 via the
		// mediaDirectUpload mutation.
		directUploadId: "xxxxxxxxxxx",

		// The ID of an existing attachment object. Use this when updating a resource and
		// keeping a subset of the attachments. Don't use this unless you know what you're doing.
		id: "xxxxxxxxxxx",
	} /* Required! */,

	// Checksum of the app build file. This is generated by the client and used to
	// verify the integrity of the file that is submitted when un-packaged later on a device.
	checksum: "some string" /* Required! */,

	// The platform of the app build (ios, android, web)
	platform: "android" /* Valid values: android | ios | web */ /* Required! */,

	// Supported app view types for the app build. A build can specify multiple view
	// types, but should only specify ones that its code supports.
	supportedAppViewTypes: [
		"analytics" /* Valid values: analytics | dash | discover | hub */,
	],
});

```

Example output:

```typescript
const response = {
	// The ID of the app build. It will look like apbu_xxxxx.
	id: "xxxxxxxxxxx",

	// When this app build was created.
	createdAt: 1716931200,

	// The URL to download the app build .zip file.
	fileUrl: "some string",

	// This is generated by the client and used to verify the integrity of the file
	// that is submitted. It is a SHA256 hash of the app build file.
	checksum: "some string",

	// The platform of the app build (ios, android, web)
	platform: "android" /* Valid values: android | ios | web */,

	// The review message for the app build, if any. This is populated when the build
	// is rejected and there is a reason specified by the reviewer.
	reviewMessage: "some string",

	// The supported app view types for the app build. These are the views that the
	// developer has specified that this build supports.
	supportedAppViewTypes: [
		"analytics" /* Valid values: analytics | dash | discover | hub */,
	],

	// The status of the app build (draft, approved, rejected, pending, etc)
	status: "approved" /* Valid values: approved | draft | pending | rejected */,
};

```


# Get Attachment
Source: https://dev.whop.com/sdk/api/attachments/get-attachment

Returns the attachment

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.attachments.getAttachment({
	// The ID of the attachment
	id: "xxxxxxxxxxx" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The ID of the attachment
	id: "xxxxxxxxxxx",

	// A signed ID of the attachment to directly query the attachment
	signedId: "xxxxxxxxxxx",

	// Whether the attachment has been analyzed
	analyzed: true,

	// The size of the file in bytes
	byteSizeV2: "9999999",

	// The name of the file
	filename: "some string",

	// The attachment's content type (e.g., image/jpg, video/mp4)
	contentType: "some string",

	// The source of the attachment
	source: {
		// The URL to access the attachment
		url: "some string",
	},

	// The blurhash of the image
	blurhash: "some string",

	// The height of the video
	height: 10,

	// The width of the video
	width: 10,

	// The aspect ratio of the video
	aspectRatio: 10,

	// The preview of the video
	preview: {
		// The URL to access the attachment
		url: "some string",
	},

	// The duration of the audio in seconds
	duration: 10,

	// The URL of the waveform for the audio
	waveformUrl: "some string",
};

```


# Process Attachment
Source: https://dev.whop.com/sdk/api/attachments/process-attachment



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.attachments.processAttachment({
	// The ID returned by the direct upload mutation
	directUploadId: "some string" /* Required! */,

	// The type of media to analyze
	mediaType:
		"audio" /* Valid values: audio | image | other | video */ /* Required! */,

	// The parts of the multipart upload
	multipartParts: [
		{
			// The ETag of the part
			etag: "some string" /* Required! */,

			// The part number of the part
			partNumber: 10 /* Required! */,
		},
	],

	// The ID returned by the direct upload mutation
	multipartUploadId: "some string",
});

```

Example output:

```typescript
const response = true;

```


# Upload Media
Source: https://dev.whop.com/sdk/api/attachments/upload-media



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.attachments.uploadMedia({
	// The size of the file in bytes
	byteSize: 10,

	// The size of the file in bytes
	byteSizeV2: "9999999",

	// The checksum of the file
	checksum: "some string" /* Required! */,

	// The content type of the file
	contentType: "some string",

	// The filename of the file
	filename: "some string" /* Required! */,

	// The metadata of the file
	metadata: { any: "json" },

	// Whether or not to use multipart upload. The file must be larger than 5MB
	multipart: true,

	// The type of record to attach the file to
	record:
		"abuse_report" /* Valid values: abuse_report | access_pass | app | assessment_question | automated_messages_config | bot | bounty | bounty_submission | competition_prize | content_reward_campaign | content_reward_submission | course_lesson | dispute | dms_post | experience | forum_post | resolution_event_upload | review | review_report | user */ /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The signed ID of the blob
	id: "xxxxxxxxxxx",

	// The headers for the upload
	headers: { any: "json" },

	// The URL to upload the blob
	uploadUrl: "some string",

	// The multipart upload ID
	multipartUploadId: "some string",

	// The URLs for the parts of the multipart upload
	multipartUploadUrls: [
		{
			// The part number of the part
			partNumber: 10,

			// The url to upload the part
			url: "some string",
		},
	],
};

```


# Get Company Ledger Account
Source: https://dev.whop.com/sdk/api/companies/get-company-ledger-account

Fetch a company

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.companies.getCompanyLedgerAccount({
	// ID of the company, either the tag (biz_xxx) or the page route (whop-dev)
	companyId: "biz_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The ledger account for the company.
	// Roles: owner
	ledgerAccount: {
		// The ID of the LedgerAccount.
		id: "xxxxxxxxxxx",

		// The fee for transfers, if applicable.
		transferFee: 10,

		// The balances associated with the account.
		balanceCaches: {
			// A list of nodes.
			nodes: [
				{
					// The amount of the balance.
					balance: 10,

					// The amount of the balance that is pending.
					pendingBalance: 10,

					// The currency of the balance.
					currency:
						"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,
				},
			],
		},
	},
};

```


# Get Waitlist Entries For Company
Source: https://dev.whop.com/sdk/api/companies/get-waitlist-entries-for-company

Fetch a company

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.companies.getWaitlistEntriesForCompany({
	// ID of the company, either the tag (biz_xxx) or the page route (whop-dev)
	companyId: "biz_XXXXXXXX" /* Required! */,

	after: "pageInfo.endCursor",

	before: "pageInfo.startCursor",

	first: 10,

	last: 10,
});

```

Example output:

```typescript
const response = {
	// The creator dashboard table for the company
	creatorDashboardTable: {
		// Entries
		entries: {
			// A list of nodes.
			nodes: [
				{
					// The status of the entry.
					status: "any" /* Valid values: any | approved | denied | pending */,

					// The name of the raffle/waitlist.
					name: "some string",

					// Responses collected from the user when submitting their entry.
					customFieldResponses: [
						{
							// The question asked by the custom field
							question: "some string",

							// The response a user gave to the specific question or field.
							answer: "some string",
						},
					],

					// The plan the entry is connected to.
					plan: {
						// The internal ID of the plan.
						id: "xxxxxxxxxxx",
					},

					// The user who created the entry.
					user: {
						// The internal ID of the user.
						id: "xxxxxxxxxxx",

						// The username of the user from their Whop account.
						username: "some string",

						// The user's profile picture
						profilePicture: {
							// The original URL of the attachment, such as a direct link to S3. This should
							// never be displayed on the client and always passed to an Imgproxy transformer.
							sourceUrl: "some string",
						},
					},
				},
			],

			// Information to aid in pagination.
			pageInfo: {
				// When paginating forwards, are there more items?
				hasNextPage: true,

				// When paginating backwards, are there more items?
				hasPreviousPage: true,

				// When paginating backwards, the cursor to continue.
				startCursor: "some string",

				// When paginating forwards, the cursor to continue.
				endCursor: "some string",
			},

			// The total number of items in this connection.
			totalCount: 10,
		},
	},
};

```


# Create Assessment Question
Source: https://dev.whop.com/sdk/api/courses/create-assessment-question



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.createAssessmentQuestion({
	// The correct answer to the assessment question
	correctAnswer: "some string" /* Required! */,

	// The ID of the lesson to create the assessment question in
	lessonId: "lesn_XXXXXXXX" /* Required! */,

	// The text of the question being asked
	questionText: "some string" /* Required! */,

	// The type of the assessment question
	questionType:
		"multiple_choice" /* Valid values: multiple_choice | multiple_select | short_answer | true_false */ /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The ID of the assessment question
	id: "xxxxxxxxxxx",

	// The correct answer for the question. Used for short answer questions
	correctAnswer: "some string",

	// Optional image attachment for the question
	image: {
		// The ID of the attachment
		id: "xxxxxxxxxxx",

		// A signed ID of the attachment to directly query the attachment
		signedId: "xxxxxxxxxxx",

		// Whether the attachment has been analyzed
		analyzed: true,

		// The size of the file in bytes
		byteSizeV2: "9999999",

		// The name of the file
		filename: "some string",

		// The attachment's content type (e.g., image/jpg, video/mp4)
		contentType: "some string",

		// The source of the attachment
		source: {
			// The URL to access the attachment
			url: "some string",
		},

		// The blurhash of the image
		blurhash: "some string",

		// The height of the video
		height: 10,

		// The width of the video
		width: 10,

		// The aspect ratio of the video
		aspectRatio: 10,

		// The preview of the video
		preview: {
			// The URL to access the attachment
			url: "some string",
		},

		// The duration of the audio in seconds
		duration: 10,

		// The URL of the waveform for the audio
		waveformUrl: "some string",
	},

	// The answer options for multiple choice/select questions
	options: [
		{
			// The ID of the assessment question option
			id: "xxxxxxxxxxx",

			// Whether this option is a correct answer
			isCorrect: true,

			// The text of the answer option
			optionText: "some string",

			// The order of this option within the question
			order: 10,
		},
	],

	// The order of the question within its lesson
	order: 10,

	// The text of the question
	questionText: "some string",

	// The type of the question
	questionType:
		"multiple_choice" /* Valid values: multiple_choice | multiple_select | short_answer | true_false */,
};

```


# Create Chapter
Source: https://dev.whop.com/sdk/api/courses/create-chapter



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.createChapter({
	// The ID of the course to create the chapter in
	courseId: "cors_XXXXXXXX" /* Required! */,

	// The title of the chapter
	title: "some string",
});

```

Example output:

```typescript
const response = {
	// The ID of the chapter. Looks like chap_XXX
	id: "xxxxxxxxxxx",

	// The title of the chapter
	title: "some string",

	// The order of the chapter within its course
	order: 10,

	// The lessons in this chapter
	lessons: [
		{
			// The ID of the lesson
			id: "xxxxxxxxxxx",

			// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
			lessonType:
				"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

			// The title of the lesson
			title: "some string",

			// The order of the lesson within its chapter
			order: 10,

			// The visibility of the lesson. Determines how / whether this lesson is visible to users.
			visibility: "hidden" /* Valid values: hidden | visible */,

			// Number of days from course start until the lesson is unlocked
			daysFromCourseStartUntilUnlock: 10,

			// The content of the lesson
			content: "some string",

			// The associated Mux asset for video lessons
			muxAsset: {
				// The ID of the Mux asset
				id: "xxxxxxxxxxx",

				// The Mux-provided ID of the asset
				muxAssetId: "some string",

				// The public playback ID of the Mux asset
				playbackId: "some string",

				// The signed playback ID of the Mux asset
				signedPlaybackId: "some string",

				// The signed thumbnail playback token of the Mux asset
				signedThumbnailPlaybackToken: "some string",

				// The signed video playback token of the Mux asset
				signedVideoPlaybackToken: "some string",

				// The signed storyboard playback token of the Mux asset
				signedStoryboardPlaybackToken: "some string",

				// The duration of the video in seconds
				durationSeconds: 10,

				// The status of the Mux asset
				status: "created" /* Valid values: created | ready | uploading */,

				// The time at which the video finished uploading
				finishedUploadingAt: 1716931200,
			},
		},
	],
};

```


# Create Course
Source: https://dev.whop.com/sdk/api/courses/create-course



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.createCourse({
	// The cover image URL of the course
	coverImage: "some string",

	// The ID of the experience to create the course in
	experienceId: "exp_XXXXXXXX" /* Required! */,

	// The tagline of the course
	tagline: "some string",

	// The title of the course
	title: "some string" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// Whether the course will award its students a PDF certificate after completing all lessons
	certificateAfterCompletionEnabled: true,

	// The chapters in this course
	chapters: [
		{
			// The ID of the chapter. Looks like chap_XXX
			id: "xxxxxxxxxxx",

			// The title of the chapter
			title: "some string",

			// The order of the chapter within its course
			order: 10,

			// The lessons in this chapter
			lessons: [
				{
					// The ID of the lesson
					id: "xxxxxxxxxxx",

					// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
					lessonType:
						"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

					// The title of the lesson
					title: "some string",

					// The order of the lesson within its chapter
					order: 10,

					// The visibility of the lesson. Determines how / whether this lesson is visible to users.
					visibility: "hidden" /* Valid values: hidden | visible */,

					// Number of days from course start until the lesson is unlocked
					daysFromCourseStartUntilUnlock: 10,

					// The content of the lesson
					content: "some string",

					// The associated Mux asset for video lessons
					muxAsset: {
						// The ID of the Mux asset
						id: "xxxxxxxxxxx",

						// The Mux-provided ID of the asset
						muxAssetId: "some string",

						// The public playback ID of the Mux asset
						playbackId: "some string",

						// The signed playback ID of the Mux asset
						signedPlaybackId: "some string",

						// The signed thumbnail playback token of the Mux asset
						signedThumbnailPlaybackToken: "some string",

						// The signed video playback token of the Mux asset
						signedVideoPlaybackToken: "some string",

						// The signed storyboard playback token of the Mux asset
						signedStoryboardPlaybackToken: "some string",

						// The duration of the video in seconds
						durationSeconds: 10,

						// The status of the Mux asset
						status: "created" /* Valid values: created | ready | uploading */,

						// The time at which the video finished uploading
						finishedUploadingAt: 1716931200,
					},
				},
			],
		},
	],

	// The URL of the course's cover image, which is shown in course preview cards
	coverImage: "some string",

	// A short description of the course
	description: "some string",

	// The ID of the course. Looks like cors_XXX
	id: "xxxxxxxxxxx",

	// The language spoken in the video content of the course, used to generate closed captions in the right language
	language:
		"bg" /* Valid values: bg | ca | cs | da | de | el | en | es | fi | fr | hr | it | nl | no | pl | pt | ro | ru | sk | sv | tr | uk */,

	// Whether the course requires students to complete the previous lesson before moving on to the next one
	requireCompletingLessonsInOrder: true,

	// A short tagline for the course. It is displayed under the course title in the UI
	tagline: "some string",

	// The title of the course
	title: "some string",

	// Whether to apply protections on videos in the course (such as overlaying your user id, and logging tampering attempts)
	videoProtectionEnabled: true,
};

```


# Create Lesson
Source: https://dev.whop.com/sdk/api/courses/create-lesson



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.createLesson({
	// The ID of the chapter to create the lesson in
	chapterId: "chap_XXXXXXXX" /* Required! */,

	// The content of the lesson
	content: "some string",

	// Days from course start until unlock
	daysFromCourseStartUntilUnlock: 10,

	// The type of the lesson
	lessonType:
		"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */ /* Required! */,

	// The title of the lesson
	title: "some string",
});

```

Example output:

```typescript
const response = {
	// The ID of the lesson
	id: "xxxxxxxxxxx",

	// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
	lessonType:
		"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

	// The title of the lesson
	title: "some string",

	// The order of the lesson within its chapter
	order: 10,

	// The visibility of the lesson. Determines how / whether this lesson is visible to users.
	visibility: "hidden" /* Valid values: hidden | visible */,

	// The content of the lesson
	content: "some string",

	// Number of days from course start until the lesson is unlocked
	daysFromCourseStartUntilUnlock: 10,

	// The associated Mux asset for video lessons
	muxAsset: {
		// The ID of the Mux asset
		id: "xxxxxxxxxxx",

		// The Mux-provided ID of the asset
		muxAssetId: "some string",

		// The public playback ID of the Mux asset
		playbackId: "some string",

		// The signed playback ID of the Mux asset
		signedPlaybackId: "some string",

		// The signed thumbnail playback token of the Mux asset
		signedThumbnailPlaybackToken: "some string",

		// The signed video playback token of the Mux asset
		signedVideoPlaybackToken: "some string",

		// The signed storyboard playback token of the Mux asset
		signedStoryboardPlaybackToken: "some string",

		// The duration of the video in seconds
		durationSeconds: 10,

		// The status of the Mux asset
		status: "created" /* Valid values: created | ready | uploading */,

		// The time at which the video finished uploading
		finishedUploadingAt: 1716931200,
	},

	// Assessment questions for quiz/knowledge check lessons
	assessmentQuestions: [
		{
			// The ID of the assessment question
			id: "xxxxxxxxxxx",

			// The correct answer for the question. Used for short answer questions
			correctAnswer: "some string",

			// Optional image attachment for the question
			image: {
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},

			// The answer options for multiple choice/select questions
			options: [
				{
					// The ID of the assessment question option
					id: "xxxxxxxxxxx",

					// Whether this option is a correct answer
					isCorrect: true,

					// The text of the answer option
					optionText: "some string",

					// The order of this option within the question
					order: 10,
				},
			],

			// The order of the question within its lesson
			order: 10,

			// The text of the question
			questionText: "some string",

			// The type of the question
			questionType:
				"multiple_choice" /* Valid values: multiple_choice | multiple_select | short_answer | true_false */,
		},
	],

	// The attached files in this lesson
	attachments: {
		// A list of nodes.
		nodes: [
			{
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},
		],
	},

	// The main PDF file for this lesson
	mainPdf: {
		// The ID of the attachment
		id: "xxxxxxxxxxx",

		// A signed ID of the attachment to directly query the attachment
		signedId: "xxxxxxxxxxx",

		// Whether the attachment has been analyzed
		analyzed: true,

		// The size of the file in bytes
		byteSizeV2: "9999999",

		// The name of the file
		filename: "some string",

		// The attachment's content type (e.g., image/jpg, video/mp4)
		contentType: "some string",

		// The source of the attachment
		source: {
			// The URL to access the attachment
			url: "some string",
		},

		// The blurhash of the image
		blurhash: "some string",

		// The height of the video
		height: 10,

		// The width of the video
		width: 10,

		// The aspect ratio of the video
		aspectRatio: 10,

		// The preview of the video
		preview: {
			// The URL to access the attachment
			url: "some string",
		},

		// The duration of the audio in seconds
		duration: 10,

		// The URL of the waveform for the audio
		waveformUrl: "some string",
	},
};

```


# Delete Assessment Question Image
Source: https://dev.whop.com/sdk/api/courses/delete-assessment-question-image



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.deleteAssessmentQuestionImage({
	// The ID of the attachment to delete
	id: "xxxxxxxxxxx" /* Required! */,
});

```

Example output:

```typescript
const response = true;

```


# Delete Chapter
Source: https://dev.whop.com/sdk/api/courses/delete-chapter



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.deleteChapter({
	// The ID of the chapter to delete
	id: "xxxxxxxxxxx" /* Required! */,
});

```

Example output:

```typescript
const response = true;

```


# Delete Lesson
Source: https://dev.whop.com/sdk/api/courses/delete-lesson



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.deleteLesson({
	// The ID of the lesson to delete
	id: "xxxxxxxxxxx" /* Required! */,
});

```

Example output:

```typescript
const response = true;

```


# Delete Lesson Attachment
Source: https://dev.whop.com/sdk/api/courses/delete-lesson-attachment



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.deleteLessonAttachment({
	// The ID of the attachment to delete
	id: "xxxxxxxxxxx" /* Required! */,
});

```

Example output:

```typescript
const response = true;

```


# Get Course
Source: https://dev.whop.com/sdk/api/courses/get-course

A course from a courses app experience

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.getCourse({
	// The ID of the course to fetch.
	courseId: "cors_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// Whether the course will award its students a PDF certificate after completing all lessons
	certificateAfterCompletionEnabled: true,

	// The chapters in this course
	chapters: [
		{
			// The ID of the chapter. Looks like chap_XXX
			id: "xxxxxxxxxxx",

			// The title of the chapter
			title: "some string",

			// The order of the chapter within its course
			order: 10,

			// The lessons in this chapter
			lessons: [
				{
					// The ID of the lesson
					id: "xxxxxxxxxxx",

					// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
					lessonType:
						"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

					// The title of the lesson
					title: "some string",

					// The order of the lesson within its chapter
					order: 10,

					// The visibility of the lesson. Determines how / whether this lesson is visible to users.
					visibility: "hidden" /* Valid values: hidden | visible */,

					// Number of days from course start until the lesson is unlocked
					daysFromCourseStartUntilUnlock: 10,

					// The content of the lesson
					content: "some string",

					// The associated Mux asset for video lessons
					muxAsset: {
						// The ID of the Mux asset
						id: "xxxxxxxxxxx",

						// The Mux-provided ID of the asset
						muxAssetId: "some string",

						// The public playback ID of the Mux asset
						playbackId: "some string",

						// The signed playback ID of the Mux asset
						signedPlaybackId: "some string",

						// The signed thumbnail playback token of the Mux asset
						signedThumbnailPlaybackToken: "some string",

						// The signed video playback token of the Mux asset
						signedVideoPlaybackToken: "some string",

						// The signed storyboard playback token of the Mux asset
						signedStoryboardPlaybackToken: "some string",

						// The duration of the video in seconds
						durationSeconds: 10,

						// The status of the Mux asset
						status: "created" /* Valid values: created | ready | uploading */,

						// The time at which the video finished uploading
						finishedUploadingAt: 1716931200,
					},
				},
			],
		},
	],

	// The URL of the course's cover image, which is shown in course preview cards
	coverImage: "some string",

	// A short description of the course
	description: "some string",

	// The ID of the course. Looks like cors_XXX
	id: "xxxxxxxxxxx",

	// The language spoken in the video content of the course, used to generate closed captions in the right language
	language:
		"bg" /* Valid values: bg | ca | cs | da | de | el | en | es | fi | fr | hr | it | nl | no | pl | pt | ro | ru | sk | sv | tr | uk */,

	// Whether the course requires students to complete the previous lesson before moving on to the next one
	requireCompletingLessonsInOrder: true,

	// A short tagline for the course. It is displayed under the course title in the UI
	tagline: "some string",

	// The title of the course
	title: "some string",

	// Whether to apply protections on videos in the course (such as overlaying your user id, and logging tampering attempts)
	videoProtectionEnabled: true,
};

```


# Get Lesson
Source: https://dev.whop.com/sdk/api/courses/get-lesson

A course from a courses app experience

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.getLesson({
	// The ID of the course to fetch.
	courseId: "cors_XXXXXXXX" /* Required! */,

	lessonId: "lesn_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// Get a specific lesson by ID
	lesson: {
		// The ID of the lesson
		id: "xxxxxxxxxxx",

		// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
		lessonType:
			"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

		// The title of the lesson
		title: "some string",

		// The order of the lesson within its chapter
		order: 10,

		// The visibility of the lesson. Determines how / whether this lesson is visible to users.
		visibility: "hidden" /* Valid values: hidden | visible */,

		// The content of the lesson
		content: "some string",

		// Number of days from course start until the lesson is unlocked
		daysFromCourseStartUntilUnlock: 10,

		// The associated Mux asset for video lessons
		muxAsset: {
			// The ID of the Mux asset
			id: "xxxxxxxxxxx",

			// The Mux-provided ID of the asset
			muxAssetId: "some string",

			// The public playback ID of the Mux asset
			playbackId: "some string",

			// The signed playback ID of the Mux asset
			signedPlaybackId: "some string",

			// The signed thumbnail playback token of the Mux asset
			signedThumbnailPlaybackToken: "some string",

			// The signed video playback token of the Mux asset
			signedVideoPlaybackToken: "some string",

			// The signed storyboard playback token of the Mux asset
			signedStoryboardPlaybackToken: "some string",

			// The duration of the video in seconds
			durationSeconds: 10,

			// The status of the Mux asset
			status: "created" /* Valid values: created | ready | uploading */,

			// The time at which the video finished uploading
			finishedUploadingAt: 1716931200,
		},

		// Assessment questions for quiz/knowledge check lessons
		assessmentQuestions: [
			{
				// The ID of the assessment question
				id: "xxxxxxxxxxx",

				// The correct answer for the question. Used for short answer questions
				correctAnswer: "some string",

				// Optional image attachment for the question
				image: {
					// The ID of the attachment
					id: "xxxxxxxxxxx",

					// A signed ID of the attachment to directly query the attachment
					signedId: "xxxxxxxxxxx",

					// Whether the attachment has been analyzed
					analyzed: true,

					// The size of the file in bytes
					byteSizeV2: "9999999",

					// The name of the file
					filename: "some string",

					// The attachment's content type (e.g., image/jpg, video/mp4)
					contentType: "some string",

					// The source of the attachment
					source: {
						// The URL to access the attachment
						url: "some string",
					},

					// The blurhash of the image
					blurhash: "some string",

					// The height of the video
					height: 10,

					// The width of the video
					width: 10,

					// The aspect ratio of the video
					aspectRatio: 10,

					// The preview of the video
					preview: {
						// The URL to access the attachment
						url: "some string",
					},

					// The duration of the audio in seconds
					duration: 10,

					// The URL of the waveform for the audio
					waveformUrl: "some string",
				},

				// The answer options for multiple choice/select questions
				options: [
					{
						// The ID of the assessment question option
						id: "xxxxxxxxxxx",

						// Whether this option is a correct answer
						isCorrect: true,

						// The text of the answer option
						optionText: "some string",

						// The order of this option within the question
						order: 10,
					},
				],

				// The order of the question within its lesson
				order: 10,

				// The text of the question
				questionText: "some string",

				// The type of the question
				questionType:
					"multiple_choice" /* Valid values: multiple_choice | multiple_select | short_answer | true_false */,
			},
		],

		// The attached files in this lesson
		attachments: {
			// A list of nodes.
			nodes: [
				{
					// The ID of the attachment
					id: "xxxxxxxxxxx",

					// A signed ID of the attachment to directly query the attachment
					signedId: "xxxxxxxxxxx",

					// Whether the attachment has been analyzed
					analyzed: true,

					// The size of the file in bytes
					byteSizeV2: "9999999",

					// The name of the file
					filename: "some string",

					// The attachment's content type (e.g., image/jpg, video/mp4)
					contentType: "some string",

					// The source of the attachment
					source: {
						// The URL to access the attachment
						url: "some string",
					},

					// The blurhash of the image
					blurhash: "some string",

					// The height of the video
					height: 10,

					// The width of the video
					width: 10,

					// The aspect ratio of the video
					aspectRatio: 10,

					// The preview of the video
					preview: {
						// The URL to access the attachment
						url: "some string",
					},

					// The duration of the audio in seconds
					duration: 10,

					// The URL of the waveform for the audio
					waveformUrl: "some string",
				},
			],
		},

		// The main PDF file for this lesson
		mainPdf: {
			// The ID of the attachment
			id: "xxxxxxxxxxx",

			// A signed ID of the attachment to directly query the attachment
			signedId: "xxxxxxxxxxx",

			// Whether the attachment has been analyzed
			analyzed: true,

			// The size of the file in bytes
			byteSizeV2: "9999999",

			// The name of the file
			filename: "some string",

			// The attachment's content type (e.g., image/jpg, video/mp4)
			contentType: "some string",

			// The source of the attachment
			source: {
				// The URL to access the attachment
				url: "some string",
			},

			// The blurhash of the image
			blurhash: "some string",

			// The height of the video
			height: 10,

			// The width of the video
			width: 10,

			// The aspect ratio of the video
			aspectRatio: 10,

			// The preview of the video
			preview: {
				// The URL to access the attachment
				url: "some string",
			},

			// The duration of the audio in seconds
			duration: 10,

			// The URL of the waveform for the audio
			waveformUrl: "some string",
		},
	},
};

```


# Get User Lesson Interactions
Source: https://dev.whop.com/sdk/api/courses/get-user-lesson-interactions

A course from a courses app experience

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.getUserLessonInteractions({
	// The ID of the course to fetch.
	courseId: "cors_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The chapters in this course
	chapters: [
		{
			// The ID of the chapter. Looks like chap_XXX
			id: "xxxxxxxxxxx",

			// The lessons in this chapter
			lessons: [
				{
					// The ID of the lesson
					id: "xxxxxxxxxxx",

					// The user's lesson interactions for this lesson
					lessonInteraction: {
						// The ID of the lesson interaction
						id: "xxxxxxxxxxx",

						// Whether the lesson has been completed by the user
						completed: true,

						// When the interaction was created
						createdAt: 1716931200,
					},
				},
			],
		},
	],
};

```


# List Courses For Company
Source: https://dev.whop.com/sdk/api/courses/list-courses-for-company

Fetch a company

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.listCoursesForCompany({
	// ID of the company, either the tag (biz_xxx) or the page route (whop-dev)
	companyId: "biz_XXXXXXXX" /* Required! */,

	first: 10,

	after: "pageInfo.endCursor",
});

```

Example output:

```typescript
const response = {
	// The courses in the company's experiences
	courses: {
		// A list of nodes.
		nodes: [
			{
				// The ID of the course. Looks like cors_XXX
				id: "xxxxxxxxxxx",

				// The title of the course
				title: "some string",

				// The URL of the course's cover image, which is shown in course preview cards
				coverImage: "some string",

				// The experience that the course belongs to
				experience: {
					// The unique ID representing this experience
					id: "xxxxxxxxxxx",

					// The access passes that are associated with this experience. This should not be
					// used unless you are trying to list all access passes the experience has, for
					// some reason. You probably don't want to use this though and should be using accessPass.
					accessPasses: [
						{
							// The internal ID of the public access pass.
							id: "xxxxxxxxxxx",

							// The title of the access pass. Use for Whop 4.0.
							title: "some string",
						},
					],
				},
			},
		],

		// The total number of items in this connection.
		totalCount: 10,

		// Information to aid in pagination.
		pageInfo: {
			// When paginating forwards, are there more items?
			hasNextPage: true,

			// When paginating forwards, the cursor to continue.
			endCursor: "some string",
		},
	},
};

```


# List Courses For Experience
Source: https://dev.whop.com/sdk/api/courses/list-courses-for-experience

Fetch an experience.

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.listCoursesForExperience({
	// The ID of the experience
	experienceId: "exp_XXXXXXXX" /* Required! */,

	first: 10,

	after: "pageInfo.endCursor",
});

```

Example output:

```typescript
const response = {
	// The courses for the experience
	courses: {
		// A list of nodes.
		nodes: [
			{
				// Whether the course will award its students a PDF certificate after completing all lessons
				certificateAfterCompletionEnabled: true,

				// The chapters in this course
				chapters: [
					{
						// The ID of the chapter. Looks like chap_XXX
						id: "xxxxxxxxxxx",

						// The title of the chapter
						title: "some string",

						// The order of the chapter within its course
						order: 10,

						// The lessons in this chapter
						lessons: [
							{
								// The ID of the lesson
								id: "xxxxxxxxxxx",

								// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
								lessonType:
									"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

								// The title of the lesson
								title: "some string",

								// The order of the lesson within its chapter
								order: 10,

								// The visibility of the lesson. Determines how / whether this lesson is visible to users.
								visibility: "hidden" /* Valid values: hidden | visible */,

								// Number of days from course start until the lesson is unlocked
								daysFromCourseStartUntilUnlock: 10,

								// The content of the lesson
								content: "some string",

								// The associated Mux asset for video lessons
								muxAsset: {
									// The ID of the Mux asset
									id: "xxxxxxxxxxx",

									// The Mux-provided ID of the asset
									muxAssetId: "some string",

									// The public playback ID of the Mux asset
									playbackId: "some string",

									// The signed playback ID of the Mux asset
									signedPlaybackId: "some string",

									// The signed thumbnail playback token of the Mux asset
									signedThumbnailPlaybackToken: "some string",

									// The signed video playback token of the Mux asset
									signedVideoPlaybackToken: "some string",

									// The signed storyboard playback token of the Mux asset
									signedStoryboardPlaybackToken: "some string",

									// The duration of the video in seconds
									durationSeconds: 10,

									// The status of the Mux asset
									status:
										"created" /* Valid values: created | ready | uploading */,

									// The time at which the video finished uploading
									finishedUploadingAt: 1716931200,
								},
							},
						],
					},
				],

				// The URL of the course's cover image, which is shown in course preview cards
				coverImage: "some string",

				// A short description of the course
				description: "some string",

				// The ID of the course. Looks like cors_XXX
				id: "xxxxxxxxxxx",

				// The language spoken in the video content of the course, used to generate closed captions in the right language
				language:
					"bg" /* Valid values: bg | ca | cs | da | de | el | en | es | fi | fr | hr | it | nl | no | pl | pt | ro | ru | sk | sv | tr | uk */,

				// Whether the course requires students to complete the previous lesson before moving on to the next one
				requireCompletingLessonsInOrder: true,

				// A short tagline for the course. It is displayed under the course title in the UI
				tagline: "some string",

				// The title of the course
				title: "some string",

				// Whether to apply protections on videos in the course (such as overlaying your user id, and logging tampering attempts)
				videoProtectionEnabled: true,
			},
		],

		// The total number of items in this connection.
		totalCount: 10,

		// Information to aid in pagination.
		pageInfo: {
			// When paginating forwards, are there more items?
			hasNextPage: true,

			// When paginating forwards, the cursor to continue.
			endCursor: "some string",
		},
	},
};

```


# Mark Lesson As Completed
Source: https://dev.whop.com/sdk/api/courses/mark-lesson-as-completed



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.markLessonAsCompleted({
	// The ID of the lesson to mark as completed
	lessonId: "lesn_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = true;

```


# Move Course
Source: https://dev.whop.com/sdk/api/courses/move-course



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.moveCourse({
	// The ID of the course to move
	courseId: "cors_XXXXXXXX" /* Required! */,

	// The experience to move the course into
	destinationExperienceId: "xxxxxxxxxxx" /* Required! */,
});

```

Example output:

```typescript
const response = true;

```


# Update Chapter
Source: https://dev.whop.com/sdk/api/courses/update-chapter



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.updateChapter({
	// The ID of the chapter to update
	id: "xxxxxxxxxxx" /* Required! */,

	// The title of the chapter
	title: "some string" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The ID of the chapter. Looks like chap_XXX
	id: "xxxxxxxxxxx",

	// The title of the chapter
	title: "some string",

	// The order of the chapter within its course
	order: 10,

	// The lessons in this chapter
	lessons: [
		{
			// The ID of the lesson
			id: "xxxxxxxxxxx",

			// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
			lessonType:
				"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

			// The title of the lesson
			title: "some string",

			// The order of the lesson within its chapter
			order: 10,

			// The visibility of the lesson. Determines how / whether this lesson is visible to users.
			visibility: "hidden" /* Valid values: hidden | visible */,

			// Number of days from course start until the lesson is unlocked
			daysFromCourseStartUntilUnlock: 10,

			// The content of the lesson
			content: "some string",

			// The associated Mux asset for video lessons
			muxAsset: {
				// The ID of the Mux asset
				id: "xxxxxxxxxxx",

				// The Mux-provided ID of the asset
				muxAssetId: "some string",

				// The public playback ID of the Mux asset
				playbackId: "some string",

				// The signed playback ID of the Mux asset
				signedPlaybackId: "some string",

				// The signed thumbnail playback token of the Mux asset
				signedThumbnailPlaybackToken: "some string",

				// The signed video playback token of the Mux asset
				signedVideoPlaybackToken: "some string",

				// The signed storyboard playback token of the Mux asset
				signedStoryboardPlaybackToken: "some string",

				// The duration of the video in seconds
				durationSeconds: 10,

				// The status of the Mux asset
				status: "created" /* Valid values: created | ready | uploading */,

				// The time at which the video finished uploading
				finishedUploadingAt: 1716931200,
			},
		},
	],
};

```


# Update Chapter Order
Source: https://dev.whop.com/sdk/api/courses/update-chapter-order



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.updateChapterOrder({
	// The ID of the chapter to place this chapter below
	belowChapterId: "xxxxxxxxxxx",

	// The ID of the chapter to reorder
	chapterId: "chap_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The ID of the chapter. Looks like chap_XXX
	id: "xxxxxxxxxxx",

	// The title of the chapter
	title: "some string",

	// The order of the chapter within its course
	order: 10,

	// The lessons in this chapter
	lessons: [
		{
			// The ID of the lesson
			id: "xxxxxxxxxxx",

			// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
			lessonType:
				"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

			// The title of the lesson
			title: "some string",

			// The order of the lesson within its chapter
			order: 10,

			// The visibility of the lesson. Determines how / whether this lesson is visible to users.
			visibility: "hidden" /* Valid values: hidden | visible */,

			// Number of days from course start until the lesson is unlocked
			daysFromCourseStartUntilUnlock: 10,

			// The content of the lesson
			content: "some string",

			// The associated Mux asset for video lessons
			muxAsset: {
				// The ID of the Mux asset
				id: "xxxxxxxxxxx",

				// The Mux-provided ID of the asset
				muxAssetId: "some string",

				// The public playback ID of the Mux asset
				playbackId: "some string",

				// The signed playback ID of the Mux asset
				signedPlaybackId: "some string",

				// The signed thumbnail playback token of the Mux asset
				signedThumbnailPlaybackToken: "some string",

				// The signed video playback token of the Mux asset
				signedVideoPlaybackToken: "some string",

				// The signed storyboard playback token of the Mux asset
				signedStoryboardPlaybackToken: "some string",

				// The duration of the video in seconds
				durationSeconds: 10,

				// The status of the Mux asset
				status: "created" /* Valid values: created | ready | uploading */,

				// The time at which the video finished uploading
				finishedUploadingAt: 1716931200,
			},
		},
	],
};

```


# Update Lesson
Source: https://dev.whop.com/sdk/api/courses/update-lesson



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.updateLesson({
	// The content of the lesson
	content: "some string",

	// Days from course start until unlock
	daysFromCourseStartUntilUnlock: 10,

	// The ID of the lesson to update
	id: "xxxxxxxxxxx" /* Required! */,

	// The type of the lesson
	lessonType:
		"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

	// The ID of the Mux asset to attach to this lesson
	muxAssetId: "some string",

	// The title of the lesson
	title: "some string",

	// Determines how / whether this lesson is visible to users.
	visibility: "hidden" /* Valid values: hidden | visible */,
});

```

Example output:

```typescript
const response = {
	// The ID of the lesson
	id: "xxxxxxxxxxx",

	// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
	lessonType:
		"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

	// The title of the lesson
	title: "some string",

	// The order of the lesson within its chapter
	order: 10,

	// The visibility of the lesson. Determines how / whether this lesson is visible to users.
	visibility: "hidden" /* Valid values: hidden | visible */,

	// The content of the lesson
	content: "some string",

	// Number of days from course start until the lesson is unlocked
	daysFromCourseStartUntilUnlock: 10,

	// The associated Mux asset for video lessons
	muxAsset: {
		// The ID of the Mux asset
		id: "xxxxxxxxxxx",

		// The Mux-provided ID of the asset
		muxAssetId: "some string",

		// The public playback ID of the Mux asset
		playbackId: "some string",

		// The signed playback ID of the Mux asset
		signedPlaybackId: "some string",

		// The signed thumbnail playback token of the Mux asset
		signedThumbnailPlaybackToken: "some string",

		// The signed video playback token of the Mux asset
		signedVideoPlaybackToken: "some string",

		// The signed storyboard playback token of the Mux asset
		signedStoryboardPlaybackToken: "some string",

		// The duration of the video in seconds
		durationSeconds: 10,

		// The status of the Mux asset
		status: "created" /* Valid values: created | ready | uploading */,

		// The time at which the video finished uploading
		finishedUploadingAt: 1716931200,
	},

	// Assessment questions for quiz/knowledge check lessons
	assessmentQuestions: [
		{
			// The ID of the assessment question
			id: "xxxxxxxxxxx",

			// The correct answer for the question. Used for short answer questions
			correctAnswer: "some string",

			// Optional image attachment for the question
			image: {
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},

			// The answer options for multiple choice/select questions
			options: [
				{
					// The ID of the assessment question option
					id: "xxxxxxxxxxx",

					// Whether this option is a correct answer
					isCorrect: true,

					// The text of the answer option
					optionText: "some string",

					// The order of this option within the question
					order: 10,
				},
			],

			// The order of the question within its lesson
			order: 10,

			// The text of the question
			questionText: "some string",

			// The type of the question
			questionType:
				"multiple_choice" /* Valid values: multiple_choice | multiple_select | short_answer | true_false */,
		},
	],

	// The attached files in this lesson
	attachments: {
		// A list of nodes.
		nodes: [
			{
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},
		],
	},

	// The main PDF file for this lesson
	mainPdf: {
		// The ID of the attachment
		id: "xxxxxxxxxxx",

		// A signed ID of the attachment to directly query the attachment
		signedId: "xxxxxxxxxxx",

		// Whether the attachment has been analyzed
		analyzed: true,

		// The size of the file in bytes
		byteSizeV2: "9999999",

		// The name of the file
		filename: "some string",

		// The attachment's content type (e.g., image/jpg, video/mp4)
		contentType: "some string",

		// The source of the attachment
		source: {
			// The URL to access the attachment
			url: "some string",
		},

		// The blurhash of the image
		blurhash: "some string",

		// The height of the video
		height: 10,

		// The width of the video
		width: 10,

		// The aspect ratio of the video
		aspectRatio: 10,

		// The preview of the video
		preview: {
			// The URL to access the attachment
			url: "some string",
		},

		// The duration of the audio in seconds
		duration: 10,

		// The URL of the waveform for the audio
		waveformUrl: "some string",
	},
};

```


# Update Lesson Order
Source: https://dev.whop.com/sdk/api/courses/update-lesson-order



```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.courses.updateLessonOrder({
	// The ID of the lesson to place this lesson below
	belowLessonId: "xxxxxxxxxxx",

	// The ID of the chapter to move the lesson to
	chapterId: "chap_XXXXXXXX" /* Required! */,

	// The ID of the lesson to reorder
	lessonId: "lesn_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The ID of the lesson
	id: "xxxxxxxxxxx",

	// The type of the lesson (text, video, pdf, multi, quiz, knowledge_check)
	lessonType:
		"knowledge_check" /* Valid values: knowledge_check | multi | pdf | quiz | text | video */,

	// The title of the lesson
	title: "some string",

	// The order of the lesson within its chapter
	order: 10,

	// The visibility of the lesson. Determines how / whether this lesson is visible to users.
	visibility: "hidden" /* Valid values: hidden | visible */,

	// The content of the lesson
	content: "some string",

	// Number of days from course start until the lesson is unlocked
	daysFromCourseStartUntilUnlock: 10,

	// The associated Mux asset for video lessons
	muxAsset: {
		// The ID of the Mux asset
		id: "xxxxxxxxxxx",

		// The Mux-provided ID of the asset
		muxAssetId: "some string",

		// The public playback ID of the Mux asset
		playbackId: "some string",

		// The signed playback ID of the Mux asset
		signedPlaybackId: "some string",

		// The signed thumbnail playback token of the Mux asset
		signedThumbnailPlaybackToken: "some string",

		// The signed video playback token of the Mux asset
		signedVideoPlaybackToken: "some string",

		// The signed storyboard playback token of the Mux asset
		signedStoryboardPlaybackToken: "some string",

		// The duration of the video in seconds
		durationSeconds: 10,

		// The status of the Mux asset
		status: "created" /* Valid values: created | ready | uploading */,

		// The time at which the video finished uploading
		finishedUploadingAt: 1716931200,
	},

	// Assessment questions for quiz/knowledge check lessons
	assessmentQuestions: [
		{
			// The ID of the assessment question
			id: "xxxxxxxxxxx",

			// The correct answer for the question. Used for short answer questions
			correctAnswer: "some string",

			// Optional image attachment for the question
			image: {
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},

			// The answer options for multiple choice/select questions
			options: [
				{
					// The ID of the assessment question option
					id: "xxxxxxxxxxx",

					// Whether this option is a correct answer
					isCorrect: true,

					// The text of the answer option
					optionText: "some string",

					// The order of this option within the question
					order: 10,
				},
			],

			// The order of the question within its lesson
			order: 10,

			// The text of the question
			questionText: "some string",

			// The type of the question
			questionType:
				"multiple_choice" /* Valid values: multiple_choice | multiple_select | short_answer | true_false */,
		},
	],

	// The attached files in this lesson
	attachments: {
		// A list of nodes.
		nodes: [
			{
				// The ID of the attachment
				id: "xxxxxxxxxxx",

				// A signed ID of the attachment to directly query the attachment
				signedId: "xxxxxxxxxxx",

				// Whether the attachment has been analyzed
				analyzed: true,

				// The size of the file in bytes
				byteSizeV2: "9999999",

				// The name of the file
				filename: "some string",

				// The attachment's content type (e.g., image/jpg, video/mp4)
				contentType: "some string",

				// The source of the attachment
				source: {
					// The URL to access the attachment
					url: "some string",
				},

				// The blurhash of the image
				blurhash: "some string",

				// The height of the video
				height: 10,

				// The width of the video
				width: 10,

				// The aspect ratio of the video
				aspectRatio: 10,

				// The preview of the video
				preview: {
					// The URL to access the attachment
					url: "some string",
				},

				// The duration of the audio in seconds
				duration: 10,

				// The URL of the waveform for the audio
				waveformUrl: "some string",
			},
		],
	},

	// The main PDF file for this lesson
	mainPdf: {
		// The ID of the attachment
		id: "xxxxxxxxxxx",

		// A signed ID of the attachment to directly query the attachment
		signedId: "xxxxxxxxxxx",

		// Whether the attachment has been analyzed
		analyzed: true,

		// The size of the file in bytes
		byteSizeV2: "9999999",

		// The name of the file
		filename: "some string",

		// The attachment's content type (e.g., image/jpg, video/mp4)
		contentType: "some string",

		// The source of the attachment
		source: {
			// The URL to access the attachment
			url: "some string",
		},

		// The blurhash of the image
		blurhash: "some string",

		// The height of the video
		height: 10,

		// The width of the video
		width: 10,

		// The aspect ratio of the video
		aspectRatio: 10,

		// The preview of the video
		preview: {
			// The URL to access the attachment
			url: "some string",
		},

		// The duration of the audio in seconds
		duration: 10,

		// The URL of the waveform for the audio
		waveformUrl: "some string",
	},
};

```


# Get Experience
Source: https://dev.whop.com/sdk/api/experiences/get-experience

Fetch an experience.

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.experiences.getExperience({
	// The ID of the experience
	experienceId: "exp_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The unique ID representing this experience
	id: "xxxxxxxxxxx",

	// The written name of the description.
	name: "some string",

	// A short written description of what is being offered
	description: "some string",

	// The logo for the experience.
	logo: {
		// The original URL of the attachment, such as a direct link to S3. This should
		// never be displayed on the client and always passed to an Imgproxy transformer.
		sourceUrl: "some string",
	},

	// The experience interface for this experience.
	app: {
		// The ID of the app
		id: "xxxxxxxxxxx",

		// The name of the app
		name: "some string",

		// The icon for the app. This icon is shown on discovery, on the product page, on
		// checkout, and as a default icon for the experiences.
		icon: {
			// The original URL of the attachment, such as a direct link to S3. This should
			// never be displayed on the client and always passed to an Imgproxy transformer.
			sourceUrl: "some string",
		},
	},

	// The company that owns this experience.
	company: {
		// The ID (tag) of the company.
		id: "xxxxxxxxxxx",

		// The title of the company.
		title: "some string",
	},

	// The upsell type for the experience, if any.
	upsellType:
		"after_checkout" /* Valid values: after_checkout | before_checkout | only_in_whop */,

	// The upsell plan for the experience, if any.
	upsellPlan: {
		// The internal ID of the plan.
		id: "xxxxxxxxxxx",

		// The respective currency identifier for the plan.
		baseCurrency:
			"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,

		// The price a person has to pay for a plan on the renewal purchase.
		rawRenewalPrice: 10,

		// The price a person has to pay for a plan on the initial purchase.
		rawInitialPrice: 10,

		// How much the user has to pay on the first payment.
		initialPriceDue: 10,

		// When the plan was created.
		createdAt: 1716931200,

		// When the plan was last updated.
		updatedAt: 1716931200,

		// The interval at which the plan charges (renewal plans).
		billingPeriod: 10,

		// The number of free trial days added before a renewal plan.
		trialPeriodDays: 10,

		// The interval at which the plan charges (expiration plans).
		expirationDays: 10,

		// Limits/doesn't limit the number of units available for purchase.
		unlimitedStock: true,

		// The description of the Plan as seen by the customer on the checkout page.
		paymentLinkDescription: "some string",

		// This is the release method the business uses to sell this plan.
		releaseMethod: "buy_now" /* Valid values: buy_now | raffle | waitlist */,

		// The number of units available for purchase.
		stock: 10,

		// Shows or hides the plan from public/business view.
		visibility:
			"archived" /* Valid values: archived | hidden | quick_link | visible */,

		// Indicates if the plan is a one time payment or recurring.
		planType: "one_time" /* Valid values: one_time | renewal */,
	},
};

```


# List Access Passes For Experience
Source: https://dev.whop.com/sdk/api/experiences/list-access-passes-for-experience

Fetch an experience.

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.experiences.listAccessPassesForExperience({
	// The ID of the experience
	experienceId: "exp_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The unique ID representing this experience
	experienceId: "xxxxxxxxxxx",

	// The access passes that are associated with this experience. This should not be
	// used unless you are trying to list all access passes the experience has, for
	// some reason. You probably don't want to use this though and should be using accessPass.
	accessPasses: [
		{
			// The internal ID of the public access pass.
			id: "xxxxxxxxxxx",

			// The title of the access pass. Use for Whop 4.0.
			title: "some string",

			// A short description of what the company offers or does.
			shortenedDescription: "some string",

			// Whether this product is Whop verified.
			verified: true,

			// This access pass will/will not be displayed publicly.
			visibility:
				"archived" /* Valid values: archived | hidden | quick_link | visible */,

			// The route of the access pass.
			route: "some string",

			// The number of active users for this access pass.
			activeUsersCount: 10,

			// The logo for the access pass.
			logo: {
				// The original URL of the attachment, such as a direct link to S3. This should
				// never be displayed on the client and always passed to an Imgproxy transformer.
				sourceUrl: "some string",
			},
		},
	],
};

```


# List Experiences
Source: https://dev.whop.com/sdk/api/experiences/list-experiences

Fetch a company

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.experiences.listExperiences({
	after: "pageInfo.endCursor",

	first: 10,

	accessPassId: "prod_XXXXXXXX",

	appId: "app_XXXXXXXX",

	onAccessPass: true,

	// ID of the company, either the tag (biz_xxx) or the page route (whop-dev)
	companyId: "biz_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// All of the experiences connected to the company.
	experiencesV2: {
		// A list of nodes.
		nodes: [
			{
				// The ID of the experience
				id: "xxxxxxxxxxx",

				// The name of the experience
				name: "some string",

				// A short description of the experience
				description: "some string",

				// The image for the experience interface
				logo: {
					// Image url with requested image resolution.
					sourceUrl: "some string",
				},

				// The interface of the experience
				app: {
					// The ID of the app
					id: "xxxxxxxxxxx",

					// The name of the app
					name: "some string",

					// The icon for the app. This icon is shown on discovery, on the product page, on
					// checkout, and as a default icon for the experiences.
					icon: {
						// The original URL of the attachment, such as a direct link to S3. This should
						// never be displayed on the client and always passed to an Imgproxy transformer.
						sourceUrl: "some string",
					},
				},
			},
		],

		// Information to aid in pagination.
		pageInfo: {
			// When paginating forwards, are there more items?
			hasNextPage: true,

			// When paginating forwards, the cursor to continue.
			endCursor: "some string",
		},

		// The total number of items in this connection.
		totalCount: 10,
	},
};

```


# List Users For Experience
Source: https://dev.whop.com/sdk/api/experiences/list-users-for-experience

Fetch an experience.

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.experiences.listUsersForExperience({
	// The ID of the experience
	experienceId: "exp_XXXXXXXX" /* Required! */,

	after: "pageInfo.endCursor",

	before: "pageInfo.startCursor",

	direction: "asc" /* Valid values: asc | desc */,

	first: 10,

	searchQuery: "some string",
});

```

Example output:

```typescript
const response = {
	// The users that have access to this experience. This field will return nil if
	// you aren't authorized to view this experience's users. You must have a
	// membership or be a team member for the experience to view the user list.
	users: {
		// A list of nodes.
		nodes: [
			{
				// The internal ID of the user.
				id: "xxxxxxxxxxx",

				// The username of the user from their Whop account.
				username: "some string",

				// The user's profile picture
				profilePicture: {
					// The original URL of the attachment, such as a direct link to S3. This should
					// never be displayed on the client and always passed to an Imgproxy transformer.
					sourceUrl: "some string",
				},
			},
		],

		// Information to aid in pagination.
		pageInfo: {
			// When paginating forwards, the cursor to continue.
			endCursor: "some string",

			// When paginating forwards, are there more items?
			hasNextPage: true,

			// When paginating backwards, are there more items?
			hasPreviousPage: true,
		},

		// The total number of items in this connection.
		totalCount: 10,
	},
};

```


# Create Forum Post
Source: https://dev.whop.com/sdk/api/forums/create-forum-post



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.forums.createForumPost({
	// The access pass (whop) to create this post in (leave empty if providing a
	// forum experience ID). This will look like prod_xxxx.
	accessPassId: "prod_XXXXXXXX",

	// The attachments for this post, such as videos or images.
	attachments: [
		{
			// This ID should be used the first time you upload an attachment. It is the ID
			// of the direct upload that was created when uploading the file to S3 via the
			// mediaDirectUpload mutation.
			directUploadId: "xxxxxxxxxxx",

			// The ID of an existing attachment object. Use this when updating a resource and
			// keeping a subset of the attachments. Don't use this unless you know what you're doing.
			id: "xxxxxxxxxxx",
		},
	],

	// The content of the post. This is the main body of the post. Hidden if paywalled.
	content: "some string" /* Required! */,

	// The ID of the forum experience to send the message in. (leave empty if
	// creating a new experience). This will look like exp_xxxx.
	forumExperienceId: "some string",

	// This is used to determine if the post should be sent as a 'mention'
	// notification to all of the users who are in the experience. This means that
	// anyone with 'mentions' enabled will receive a notification about this post.
	isMention: true,

	// The ID of the parent post, if applicable (Used when making a comment)
	parentId: "post_XXXXXXXX",

	// The amount to paywall this post by. A paywalled post requires the user to purchase it in order to view its content.
	paywallAmount: 10,

	// The currency to paywall this post by. A paywalled post requires the user to purchase it in order to view its content.
	paywallCurrency:
		"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,

	// Whether the post should be pinned
	pinned: true,

	// The poll for this post. A poll lets you collect responses to a multiple choice question.
	poll: {
		// The options for the poll. Must have sequential IDs starting from 1
		options: [
			{
				// Sequential ID for the poll option (starting from '1')
				id: "some string" /* Required! */,

				// The text of the poll option
				text: "some string" /* Required! */,
			},
		] /* Required! */,
	},

	// The title of the post. Visible if paywalled.
	title: "some string",
});

```

Example output:

```typescript
const response = {
	// The unique identifier for the entity
	id: "xxxxxxxxxxx",

	// The time the entity was created (in milliseconds since Unix epoch)
	createdAt: "9999999",

	// The time the entity was last updated (in milliseconds since Unix epoch)
	updatedAt: "9999999",

	// The text content of the forum post
	content: "some string",

	// The rich content of the forum post
	richContent: "some string",

	// Whether the entity has been deleted
	isDeleted: true,

	// The attachments to this message
	attachments: [
		{
			// The ID of the attachment
			id: "xxxxxxxxxxx",

			// The attachment's content type (e.g., image/jpg, video/mp4)
			contentType: "some string",

			// The original URL of the attachment, such as a direct link to S3. This should
			// never be displayed on the client and always passed to an Imgproxy transformer.
			sourceUrl: "some string",
		},
	],

	// Whether the forum post has been edited
	isEdited: true,

	// Whether this forum post is pinned
	isPinned: true,

	// The IDs of the users mentioned in this forum post
	mentionedUserIds: ["xxxxxxxxxxx"],

	// The ID of the parent forum post, if applicable
	parentId: "xxxxxxxxxxx",

	// The number of times this message has been viewed
	viewCount: 10,

	// The user who created this forum post
	user: {
		// The internal ID of the user.
		id: "xxxxxxxxxxx",

		// The name of the user from their Whop account.
		name: "some string",

		// The username of the user from their Whop account.
		username: "some string",

		// The user's profile picture
		profilePicture: {
			// The original URL of the attachment, such as a direct link to S3. This should
			// never be displayed on the client and always passed to an Imgproxy transformer.
			sourceUrl: "some string",
		},

		// Whether or not the user's phone is verified
		phoneVerified: true,

		// The city the user is from.
		city: "some string",

		// The country the user is from.
		country: "some string",
	},
};

```


# Find Or Create Forum
Source: https://dev.whop.com/sdk/api/forums/find-or-create-forum



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.forums.findOrCreateForum({
	// The ID of the access pass (whop) to attach the experience to. It looks like prod_xxxx.
	accessPassId: "prod_XXXXXXXX",

	// The ID of an existing experience. If supplied, this new forum experience will
	// be attached to the first access pass (whop) of this experience. It looks like exp_xxxx.
	experienceId: "exp_XXXXXXXX",

	// The expiration date of the experience to be created. After this timestamp, the experience is deleted.
	expiresAt: 1716931200,

	// The name of the forum experience to be created, shown to the user on the UI.
	name: "some string" /* Required! */,

	// The upsell plan details to add for the forum experience. This allows you to
	// require paid access for the forum within the whop.
	price: {
		// The base currency of the upsell.
		baseCurrency:
			"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,

		// An array of custom field objects.
		customFields: [
			{
				// The type of the custom field.
				fieldType: "text" /* Valid values: text */ /* Required! */,

				// The ID of the custom field (if being updated)
				id: "xxxxxxxxxxx",

				// The name of the custom field.
				name: "some string" /* Required! */,

				// The order of the field.
				order: 10,

				// The placeholder value of the field.
				placeholder: "some string",

				// Whether or not the field is required.
				required: true,
			},
		],

		// The interval at which the plan charges (expiration plans).
		expirationDays: 10,

		// The price of the upsell.
		initialPrice: 10,

		// The method of release for the upsell.
		releaseMethod: "buy_now" /* Valid values: buy_now | raffle | waitlist */,
	},

	// This is who is allowed to create posts inside the forum. Select 'admin' if you
	// only want the team members to post, or select 'everyone' if any member of the
	// whop can post. Default value is 'admins'.
	whoCanPost: "admins" /* Valid values: admins | everyone */,
});

```

Example output:

```typescript
const response = {
	// The unique ID representing this experience
	id: "xxxxxxxxxxx",

	// Use this link to directly take users to the experience
	link: "some string",
};

```


# List Forum Posts From Forum
Source: https://dev.whop.com/sdk/api/forums/list-forum-posts-from-forum

Fetch feed posts for the current user

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.forums.listForumPostsFromForum({
	// The ID of the experience to fetch posts from
	experienceId: "exp_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// List of posts
	posts: [
		{
			// The unique identifier for the entity
			id: "xxxxxxxxxxx",

			// The time the entity was created (in milliseconds since Unix epoch)
			createdAt: "9999999",

			// The time the entity was last updated (in milliseconds since Unix epoch)
			updatedAt: "9999999",

			// The text content of the forum post
			content: "some string",

			// The rich content of the forum post
			richContent: "some string",

			// Whether the entity has been deleted
			isDeleted: true,

			// The attachments to this message
			attachments: [
				{
					// The ID of the attachment
					id: "xxxxxxxxxxx",

					// The attachment's content type (e.g., image/jpg, video/mp4)
					contentType: "some string",

					// The original URL of the attachment, such as a direct link to S3. This should
					// never be displayed on the client and always passed to an Imgproxy transformer.
					sourceUrl: "some string",
				},
			],

			// Whether the forum post has been edited
			isEdited: true,

			// Whether this forum post is pinned
			isPinned: true,

			// The IDs of the users mentioned in this forum post
			mentionedUserIds: ["xxxxxxxxxxx"],

			// The ID of the parent forum post, if applicable
			parentId: "xxxxxxxxxxx",

			// The number of times this message has been viewed
			viewCount: 10,

			// The user who created this forum post
			user: {
				// The internal ID of the user.
				id: "xxxxxxxxxxx",

				// The name of the user from their Whop account.
				name: "some string",

				// The username of the user from their Whop account.
				username: "some string",

				// The user's profile picture
				profilePicture: {
					// The original URL of the attachment, such as a direct link to S3. This should
					// never be displayed on the client and always passed to an Imgproxy transformer.
					sourceUrl: "some string",
				},

				// Whether or not the user's phone is verified
				phoneVerified: true,

				// The city the user is from.
				city: "some string",

				// The country the user is from.
				country: "some string",
			},
		},
	],
};

```


# Find Or Create Chat
Source: https://dev.whop.com/sdk/api/messages/find-or-create-chat



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.messages.findOrCreateChat({
	// The ID of the access pass (whop) to attach the chat experience to. It looks like prod_xxxx.
	accessPassId: "prod_XXXXXXXX",

	// The ID of an existing experience. If supplied, this new chat experience will
	// be attached to the first access pass (whop) of this experience. It looks like exp_xxxx.
	experienceId: "exp_XXXXXXXX",

	// The expiration date of the chat experience to be created. After this timestamp, the experience disappears.
	expiresAt: 1716931200,

	// The name of the chat experience to be created, shown to users in the UI.
	name: "some string" /* Required! */,

	// The upsell plan details to add for the chat experience. This allows you to
	// require paid access for the chat within the whop.
	price: {
		// The base currency of the upsell.
		baseCurrency:
			"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,

		// An array of custom field objects.
		customFields: [
			{
				// The type of the custom field.
				fieldType: "text" /* Valid values: text */ /* Required! */,

				// The ID of the custom field (if being updated)
				id: "xxxxxxxxxxx",

				// The name of the custom field.
				name: "some string" /* Required! */,

				// The order of the field.
				order: 10,

				// The placeholder value of the field.
				placeholder: "some string",

				// Whether or not the field is required.
				required: true,
			},
		],

		// The interval at which the plan charges (expiration plans).
		expirationDays: 10,

		// The price of the upsell.
		initialPrice: 10,

		// The method of release for the upsell.
		releaseMethod: "buy_now" /* Valid values: buy_now | raffle | waitlist */,
	},

	// This is who is allowed to send messages inside the chat. Select 'admin' if you
	// only want the team members to message, or select 'everyone' if any member of
	// the whop can send messages.
	whoCanPost: "admins" /* Valid values: admins | everyone */,
});

```

Example output:

```typescript
const response = {
	// The unique ID representing this experience
	id: "xxxxxxxxxxx",

	// Use this link to directly take users to the experience
	link: "some string",
};

```


# List Direct Message Conversations
Source: https://dev.whop.com/sdk/api/messages/list-direct-message-conversations

Fetch direct message or group chats for the current user. Experimental, don't use in production yet.

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.messages.listDirectMessageConversations({
	// The `last_post_sent_at` timestamp to fetch channels before
	beforeTimestamp: "9999999",

	// Maximum number of channels to return
	limit: 10,

	// Filter by user or group name, e.g. 'Jack' or 'Fight Club'
	query: "some string",

	// Filter by status (accepted, requested, etc.)
	status:
		"accepted" /* Valid values: accepted | archived | closed | hidden | requested */,

	// Filter by unread status (true or false)
	unread: true,
});

```

Example output:

```typescript
const response = [
	{
		// The timestamp when the channel was created
		createdAt: 1716931200,

		// The unique identifier of the channel, e.g. 'feed_12345'
		id: "xxxxxxxxxxx",

		// Whether or not the channel is pinned to the top of the list
		isPinned: true,

		// The custom name of the DM channel, if any
		customName: "some string",

		// Whether or not the channel is a group chat
		isGroupChat: true,

		// List of members for the channel
		feedMembers: [
			{
				// The username of the user e.g. 'jacksmith01'
				username: "some string",

				// The unique identifier of the member resource, e.g. 'feed_member_12345'
				id: "xxxxxxxxxxx",
			},
		],

		// Whether or not the channel has unread posts
		isUnread: true,

		// Last post in the channel
		lastMessage: {
			// The text content of the post
			content: "some string",

			// The ID of the user who sent this message, e.g. 'user_12345'
			userId: "xxxxxxxxxxx",
		},
	},
];

```


# List Messages From Chat
Source: https://dev.whop.com/sdk/api/messages/list-messages-from-chat

Fetch feed posts for the current user

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.messages.listMessagesFromChat({
	// The ID of the experience to fetch posts from
	chatExperienceId: "exp_XXXXXXXX",
});

```

Example output:

```typescript
const response = {
	// List of posts
	posts: [
		{
			// The unique identifier for the entity
			id: "xxxxxxxxxxx",

			// The time the entity was created (in milliseconds since Unix epoch)
			createdAt: "9999999",

			// The time the entity was last updated (in milliseconds since Unix epoch)
			updatedAt: "9999999",

			// The text content of the message
			content: "some string",

			// The rich content of the message
			richContent: "some string",

			// Whether the entity has been deleted
			isDeleted: true,

			// The attachments to this message
			attachments: [
				{
					// The ID of the attachment
					id: "xxxxxxxxxxx",

					// The attachment's content type (e.g., image/jpg, video/mp4)
					contentType: "some string",

					// The original URL of the attachment, such as a direct link to S3. This should
					// never be displayed on the client and always passed to an Imgproxy transformer.
					sourceUrl: "some string",
				},
			],

			// Whether the message has been edited
			isEdited: true,

			// Whether this message is pinned
			isPinned: true,

			// Whether everyone was mentioned in this message
			isEveryoneMentioned: true,

			// The IDs of the users mentioned in this message
			mentionedUserIds: ["xxxxxxxxxxx"],

			// The type of post
			messageType: "automated" /* Valid values: automated | regular | system */,

			// The ID of the message this is replying to, if applicable
			replyingToPostId: "xxxxxxxxxxx",

			// The number of times this message has been viewed
			viewCount: 10,

			// The user who sent this message
			user: {
				// The internal ID of the user.
				id: "xxxxxxxxxxx",

				// The name of the user from their Whop account.
				name: "some string",

				// The username of the user from their Whop account.
				username: "some string",

				// The user's profile picture
				profilePicture: {
					// The original URL of the attachment, such as a direct link to S3. This should
					// never be displayed on the client and always passed to an Imgproxy transformer.
					sourceUrl: "some string",
				},

				// Whether or not the user's phone is verified
				phoneVerified: true,

				// The city the user is from.
				city: "some string",

				// The country the user is from.
				country: "some string",
			},
		},
	],
};

```


# Send Direct Message To User
Source: https://dev.whop.com/sdk/api/messages/send-direct-message-to-user



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.messages.sendDirectMessageToUser({
	toUserIdOrUsername: "xxxxxxxxxxx" /* Required! */,

	message: "some string" /* Required! */,
});

```

Example output:

```typescript
const response = "some string";

```


# Send Message To Chat
Source: https://dev.whop.com/sdk/api/messages/send-message-to-chat



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.messages.sendMessageToChat({
	experienceId: "exp_XXXXXXXX" /* Required! */,

	message: "some string" /* Required! */,
});

```

Example output:

```typescript
const response = "some string";

```


# Send Push Notification
Source: https://dev.whop.com/sdk/api/notifications/send-push-notification



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.notifications.sendPushNotification({
	// The ID of the company team to send the notification to
	companyTeamId: "biz_XXXXXXXX",

	// The content of the notification
	content: "some string" /* Required! */,

	// The ID of the experience to send the notification to
	experienceId: "exp_XXXXXXXX",

	// An external ID for the notification
	externalId: "some string",

	// Whether the notification is a mention
	isMention: true,

	// The link to open when the notification is clicked. If you just want to append
	// a rest path use the restPath parameter. You can link to any url here.
	link: "some string",

	// The rest path to append to the generated deep link that opens your app. Use
	// [restPath] in your app path in the dashboard to read this parameter.
	restPath: "some string",

	// The ID of the user sending the notification
	senderUserId: "user_XXXXXXXX",

	// The subtitle of the notification
	subtitle: "some string",

	// The title of the notification
	title: "some string" /* Required! */,

	// The IDs of the users to send the notification to.
	userIds: ["xxxxxxxxxxx"],
});

```

Example output:

```typescript
const response = true;

```


# Charge User
Source: https://dev.whop.com/sdk/api/payments/charge-user



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.payments.chargeUser({
	// The affiliate code to use for the checkout session
	affiliateCode: "some string",

	// The amount to charge the user
	amount: 10 /* Required! */,

	// The currency to charge in
	currency:
		"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */ /* Required! */,

	// The description of the charge. Maximum 200 characters.
	description: "some string",

	// Additional metadata for the charge
	metadata: { any: "json" },

	// The URL to redirect the user to after the checkout session is created
	redirectUrl: "some string",

	// The ID of the user to charge
	userId: "user_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The status of the charge attempt
	status: "needs_action" /* Valid values: needs_action | success */,

	// The checkout session if additional action is needed
	inAppPurchase: {
		// The ID of the checkout session
		id: "xxxxxxxxxxx",

		// The ID of the plan to use for the checkout session
		planId: "xxxxxxxxxxx",
	},
};

```


# Create Checkout Session
Source: https://dev.whop.com/sdk/api/payments/create-checkout-session



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.payments.createCheckoutSession({
	// The affiliate code to use for the checkout session
	affiliateCode: "some string",

	// The metadata to use for the checkout session
	metadata: { any: "json" },

	// The ID of the plan to use for the checkout session
	planId: "xxxxxxxxxxx" /* Required! */,

	// The URL to redirect the user to after the checkout session is created
	redirectUrl: "some string",
});

```

Example output:

```typescript
const response = {
	// The ID of the checkout session
	id: "xxxxxxxxxxx",

	// The ID of the plan to use for the checkout session
	planId: "xxxxxxxxxxx",
};

```


# List Receipts For Company
Source: https://dev.whop.com/sdk/api/payments/list-receipts-for-company

Fetch a company

<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.payments.listReceiptsForCompany({
	// ID of the company, either the tag (biz_xxx) or the page route (whop-dev)
	companyId: "biz_XXXXXXXX" /* Required! */,

	first: 10,

	after: "pageInfo.endCursor",

	filter: {
		// A specific access pass.
		accessPassIds: ["xxxxxxxxxxx"],

		// The billing reason for the payment
		billingReasons: [
			"manual" /* Valid values: manual | one_time | subscription | subscription_create | subscription_cycle | subscription_update */,
		],

		// The currency of the payment.
		currencies: [
			"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,
		],

		// Which way to order the results.
		direction: "asc" /* Valid values: asc | desc */,

		// To get all memberships created before this certain time.
		endDate: 1716931200,

		// How to order the results.
		order: "created_at" /* Valid values: created_at | final_amount | paid_at */,

		// How the payment was made (method).
		paymentMethods: [
			"apple" /* Valid values: apple | coinbase | crypto | free | multi_psp | nft | paypal | platform_balance | sezzle | splitit | stripe */,
		],

		// A specific plan.
		planIds: ["xxxxxxxxxxx"],

		// The text that is being searched.
		query: "some string",

		// To get all memberships created after this certain time.
		startDate: 1716931200,

		// The state of the payment.
		statuses: [
			"failed" /* Valid values: failed | partially_refunded | past_due | refunded | succeeded */,
		],
	},
});

```

Example output:

```typescript
const response = {
	// All of a company's payments, with searching capabilities..
	// Roles: owner, admin
	receipts: {
		// A list of nodes.
		nodes: [
			{
				// The receipt ID
				id: "xxxxxxxxxxx",

				// The address of the user who made the payment.
				address: {
					// The name of the customer.
					name: "some string",

					// The line 1 of the address.
					line1: "some string",

					// The line 2 of the address.
					line2: "some string",

					// The city of the address.
					city: "some string",

					// The state of the address.
					state: "some string",

					// The postal code of the address.
					postalCode: "some string",

					// The country of the address.
					country: "some string",
				},

				// The final converted amount of the receipt in USD.
				settledUsdAmount: 10,

				// The billing reason
				billingReason: "some string",

				// The last 4 digits of the card used to make the payment.
				last4: "some string",

				// The currency of the payment.
				currency:
					"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,

				// The current state of the receipt.
				status:
					"draft" /* Valid values: draft | open | paid | pending | uncollectible | unresolved | void */,

				// The datetime the receipt was created
				createdAt: 1716931200,

				// The total of the payment amount.
				total: 10,

				// The type of card used as the payment method.
				brand: "some string",

				// The payment processor used to make this payment.
				paymentProcessor:
					"apple" /* Valid values: apple | coinbase | crypto | free | multi_psp | nft | paypal | platform_balance | sezzle | splitit | stripe */,

				// Returns the type of payment method used for the payment, if available. Ex. klarna, affirm, card, cashapp
				paymentMethodType: "some string",

				// When an alert came in that this transaction will be disputed
				disputeAlertedAt: 1716931200,

				// The final amount of this receipt.
				finalAmount: 10,

				// The final amount to show to the creator (excluding buyer fees).
				presentedFinalAmount: 10,

				// The settled amount in USD to show to the creator.
				presentedSettledUsdAmount: 10,

				// The payment refund amount(if applicable).
				refundedAmount: 10,

				// The friendly status of the receipt.
				friendlyStatus:
					"auto_refunded" /* Valid values: auto_refunded | canceled | dispute_warning | drafted | failed | incomplete | open_dispute | open_resolution | partially_refunded | past_due | pending | price_too_low | refunded | succeeded | uncollectible | unresolved */,

				// If the payment failed, the reason for the failure.
				failureMessage: "some string",

				// Whether the payment can be refunded.
				refundable: true,

				// Whether the payment can be retried.
				retryable: true,

				// The datetime the receipt was paid
				paidAt: 1716931200,

				// How much the receipt is for after fees
				amountAfterFees: 10,

				// Whether the charge was skipped because the price was too low.
				chargeSkippedPriceTooLow: true,

				// The time of the last payment attempt.
				lastPaymentAttempt: 1716931200,

				// Whether this payment was auto refunded or not
				autoRefunded: true,

				// The member attached to this receipt.
				member: {
					// The header to show on the customers page
					header: "some string",

					// The user for this member, if any.
					user: {
						// The internal ID of the user account.
						id: "xxxxxxxxxxx",

						// The whop username.
						username: "some string",

						// The user's full name.
						name: "some string",

						// The digital mailing address of the user.
						email: "some string",

						// The country the user is from.
						country: "some string",

						// The name of the country the user is from (ex. United States). If not available, falls back to the country code.
						countryName: "some string",
					},

					// The image for the member, derived from either the User or the Company Buyer.
					imageSrcset: {
						// Image url with requested image resolution.
						original: "some string",

						// Image url with double image resolution.
						double: "some string",

						// If the attachment should be rendered with sound and controls
						isVideo: true,
					},
				},

				// The plan attached to this receipt.
				plan: {
					// The internal ID of the plan.
					id: "xxxxxxxxxxx",

					// The title of the owning object.
					title: "some string",

					// The formatted price (including currency) for the plan.
					formattedPrice: "some string",

					// An additional amount charged upon first purchase (separate from the renewal price).
					initialPrice: 10,

					// The amount the customer is charged every billing period.
					renewalPrice: 10,

					// The description of the Plan as seen by the customer on the checkout page.
					paymentLinkDescription: "some string",
				},

				// The membership attached to this receipt.
				membership: {
					// The internal ID of the membership.
					id: "xxxxxxxxxxx",

					// The state of the membership.
					status:
						"active" /* Valid values: active | canceled | completed | drafted | expired | past_due | trialing | unresolved */,
				},

				// The promo code used for this receipt.
				promoCode: {
					// The ID of the promo.
					id: "xxxxxxxxxxx",

					// The specific code used to apply the promo at checkout.
					code: "some string",

					// The amount off (% or flat amount) for the promo.
					amountOff: 10,

					// The monetary currency of the promo code.
					baseCurrency:
						"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,

					// The type (% or flat amount) of the promo.
					promoType: "flat_amount" /* Valid values: flat_amount | percentage */,

					// The number of billing cycles the promo is applied for.
					numberOfIntervals: 10,
				},

				// The access pass attached to this receipt.
				accessPass: {
					// The internal ID of the public access pass.
					id: "xxxxxxxxxxx",

					// The title of the access pass. Use for Whop 4.0.
					title: "some string",
				},

				// The total of the payment amount in USD.
				totalUsdAmount: 10,

				// The risk score of the most recent charge attempt. From 0 to 100.
				mostRecentRiskScore: 10,
			},
		],

		// Information to aid in pagination.
		pageInfo: {
			// When paginating forwards, are there more items?
			hasNextPage: true,

			// When paginating forwards, the cursor to continue.
			endCursor: "some string",
		},
	},
};

```


# Pay User
Source: https://dev.whop.com/sdk/api/payments/pay-user



<Note>This operation is only available on the server.</Note>

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.payments.payUser({
	// The amount to withdraw
	amount: 10 /* Required! */,

	// The currency that is being withdrawn.
	currency:
		"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */ /* Required! */,

	// The ID of the destination (either a User tag, Bot tag, or LedgerAccount tag)
	destinationId: "xxxxxxxxxxx" /* Required! */,

	// The feed identifier to notify of the transfer.
	feedId: "feed_XXXXXXXX",

	// The feed type to notify of the transfer.
	feedType:
		"chat_feed" /* Valid values: chat_feed | dms_feed | forum_feed | livestream_feed | universal_post | user */,

	// A unique key to ensure idempotence. Use a UUID or similar.
	idempotenceKey: "some string" /* Required! */,

	// The ledger account id to transfer from.
	ledgerAccountId: "ldgr_XXXXXXXX" /* Required! */,

	// Notes for the transfer. Maximum of 50 characters.
	notes: "some string",

	// The reason for the transfer.
	reason:
		"bounty_payout" /* Valid values: bounty_payout | content_reward_fixed_payout | content_reward_payout | content_reward_return | creator_to_creator | creator_to_user | pool_top_up | team_member_payout | user_to_creator | user_to_user | wadmin_transferred_funds */,

	// The fee that the client thinks it is being charged for the transfer. Used to verify the fee.
	transferFee: 10,
});

```

Example output:

```typescript
const response = true;

```


# Get Current User
Source: https://dev.whop.com/sdk/api/users/get-current-user

Returns the current user and company.

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.users.getCurrentUser();

```

Example output:

```typescript
const response = {
	// The user the viewer is in scope of.
	user: {
		// The internal ID of the user
		id: "xxxxxxxxxxx",

		// The email address of the user
		email: "some string",

		// The name of the user
		name: "some string",

		// The Whop username for this user
		username: "some string",

		// The user's profile picture
		profilePicture: {
			// The original URL of the attachment, such as a direct link to S3. This should
			// never be displayed on the client and always passed to an Imgproxy transformer.
			sourceUrl: "some string",
		},

		// The user's bio
		bio: "some string",

		// Whether or not the user's phone is verified
		phoneVerified: true,

		// The user's banner image
		bannerImage: "some string",

		// The timestamp of when the user was created
		createdAt: 1716931200,

		// The day of the user's date of birth
		dateOfBirthDay: 10,

		// The month of the user's date of birth
		dateOfBirthMonth: 10,

		// The year of the user's date of birth
		dateOfBirthYear: 10,

		// The user's ledger account.
		ledgerAccount: {
			// The ID of the LedgerAccount.
			id: "xxxxxxxxxxx",

			// The fee for transfers, if applicable.
			transferFee: 10,

			// The balances associated with the account.
			balanceCaches: {
				// A list of nodes.
				nodes: [
					{
						// The amount of the balance.
						balance: 10,

						// The amount of the balance that is pending.
						pendingBalance: 10,

						// The currency of the balance.
						currency:
							"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,
					},
				],
			},
		},
	},
};

```


# Get User
Source: https://dev.whop.com/sdk/api/users/get-user

Fetch a specific user.

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.users.getUser({
	// ID of the user by tag or the username.
	userId: "user_XXXXXXXX" /* Required! */,
});

```

Example output:

```typescript
const response = {
	// The internal ID of the user.
	id: "xxxxxxxxxxx",

	// The name of the user from their Whop account.
	name: "some string",

	// The username of the user from their Whop account.
	username: "some string",

	// The user's profile picture
	profilePicture: {
		// The original URL of the attachment, such as a direct link to S3. This should
		// never be displayed on the client and always passed to an Imgproxy transformer.
		sourceUrl: "some string",
	},

	// The city the user is from.
	city: "some string",

	// The country the user is from.
	country: "some string",

	// The user's bio
	bio: "some string",

	// Whether or not the user's phone is verified
	phoneVerified: true,

	// The user's banner image
	banner: {
		// The original URL of the attachment, such as a direct link to S3. This should
		// never be displayed on the client and always passed to an Imgproxy transformer.
		sourceUrl: "some string",
	},

	// When the user was created.
	createdAt: 1716931200,
};

```


# Get User Ledger Account
Source: https://dev.whop.com/sdk/api/users/get-user-ledger-account

Returns the current user and company.

```typescript
import { whopSdk } from "@/lib/whop-sdk";

const result = await whopSdk.users.getUserLedgerAccount();

```

Example output:

```typescript
const response = {
	// The user the viewer is in scope of.
	user: {
		// The user's ledger account.
		ledgerAccount: {
			// The ID of the LedgerAccount.
			id: "xxxxxxxxxxx",

			// The fee for transfers, if applicable.
			transferFee: 10,

			// The balances associated with the account.
			balanceCaches: {
				// A list of nodes.
				nodes: [
					{
						// The amount of the balance.
						balance: 10,

						// The amount of the balance that is pending.
						pendingBalance: 10,

						// The currency of the balance.
						currency:
							"aed" /* Valid values: aed | all | amd | ape | ars | aud | bam | bgn | bhd | bob | brl | bsd | btc | cad | chf | clp | cop | crc | czk | dkk | dop | dzd | egp | etb | eth | eur | gbp | ghs | gmd | gtq | gyd | hkd | huf | idr | ils | inr | jmd | jod | jpy | kes | khr | krw | kwd | lkr | mad | mdl | mga | mkd | mnt | mop | mur | mxn | myr | nad | ngn | nok | nzd | omr | pen | php | pkr | pln | pyg | qar | ron | rsd | rub | rwf | sar | sek | sgd | thb | tnd | try | ttd | twd | tzs | usd | uyu | uzs | vnd | xcd | xof | zar */,
					},
				],
			},
		},
	},
};

```


# Open External Links
Source: https://dev.whop.com/sdk/external-url

Open external links from within the iFrame

If you want to open external links from within the iFrame, you can use the `openExternalLinks` function. This will close your app and move to a new website.

## Usage

<Warning>
  This function requires the iFrame SDK to be initialized. See [**iFrame
  Overview**](/sdk/iframe-setup) for more information.
</Warning>

<CodeGroup>
  ```javascript React
  "use client";
  import { useIframeSdk } from "@whop/react";

  export default function Home() {
  	const iframeSdk = useIframeSdk();
  	
  	function openLink() {
  		iframeSdk.openExternalUrl({ url: "https://google.com" });
  	}
  	
  	return <button onClick={openLink}>Click me to open Google</button>;
  }
  ```

  ```javascript Vanilla JS
  import { iframeSdk } from "@/lib/iframe-sdk";

  const navigationButtonElement = document.querySelector("button");

  if (navigationButtonElement) {
    navigationButtonElement.addEventListener("click", () => {
      iframeSdk.openExternalUrl({ url: "https://google.com" });
    });
  }
  ```
</CodeGroup>

## User Profiles

If you want to display a whop user profile, you can use the `openExternalUrl` method
and pass their profile page link which looks like `https://whop.com/@username`.

The whop app will intercept this and instead display a modal containing their user profile.

<CodeGroup>
  ```javascript React
  "use client";
  import { useIframeSdk } from "@whop/react";

  export default function Home() {
  	const iframeSdk = useIframeSdk();
  	
  	function openLink() {
  		iframeSdk.openExternalUrl({ url: "https://whop.com/@j" });
  	}
  	
  	return <button onClick={openLink}>Click me to open Google</button>;
  }
  ```

  ```javascript Vanilla JS
  import { iframeSdk } from "@/lib/iframe-sdk";

  const navigationButtonElement = document.querySelector("button");

  if (navigationButtonElement) {
    navigationButtonElement.addEventListener("click", () => {
      iframeSdk.openExternalUrl({ url: "https://whop.com/@j" });
    });
  }
  ```
</CodeGroup>

<Info>
  You can also use a user ID instead of username. The final link should look
  like this: `https://whop.com/@user_XXXXXXXX`
</Info>


# Getting Started
Source: https://dev.whop.com/sdk/iframe-setup

Getting started with the Whop iFrame SDK

Whop apps are embedded into the site using iFrames. This SDK provides a type-safe way for you to communicate with the Whop application using a request/response style API powered by `window.postMessage`.

Since this package relies on `window.postMessage`, it only works in **Client Components**.

### Relevant Packages

* `@whop/iframe` - The main package for the iframe SDK.
* `@whop/react` - A React wrapper for Whop Apps including helpers for the iframe SDK.

***

## Setup

The main function exported from the `@whop/iframe` package is the `createSdk` function. When called, this function sets up a listener for messages from the main Whop site, using `window.on('message', ...)`. It is also exposed through the `WhopIframeSdkProvider` component from `@whop/react`.

### React

If you're using React, it is recommended to use the `WhopIframeSdkProvider` component from `@whop/react` to provide the iframe SDK to all child components.

<CodeGroup>
  ```javascript Step 1: Mount provider in root layout
  // app/layout.tsx
  import { WhopIframeSdkProvider } from "@whop/react";

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode,
  }) {
    return (
      <html lang="en">
        <body>
          <WhopIframeSdkProvider>{children}</WhopIframeSdkProvider>
        </body>
      </html>
    );
  }
  ```

  ```javascript Step 2: Consume the iframe SDK in a component
  // components/example.tsx
  import { useIframeSdk } from "@whop/react";

  export const Example = () => {
    const iframeSdk = useIframeSdk();

    return (
      <button
        onClick={() => iframeSdk.openExternalUrl({ url: "https://example.com" })}
      >
        Open External URL
      </button>
    );
  };
  ```
</CodeGroup>

### Other Frameworks

For other frameworks, you can use the `createSdk` function from `@whop/iframe` to create an instance of the iframe SDK.

<CodeGroup>
  ```javascript Step 1: Create the iframe SDK instance
  // lib/iframe-sdk.ts
  import { createSdk } from "@whop/iframe";

  export const iframeSdk = createSdk({
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  });
  ```

  ```javascript Step 2: Use the iframe SDK instance
  // index.ts
  import { iframeSdk } from "@/lib/iframe-sdk";

  const navigationButtonElement = document.querySelector("button");

  if (navigationButtonElement) {
    navigationButtonElement.addEventListener("click", () => {
      iframeSdk.openExternalUrl({ url: "https://example.com" });
    });
  }
  ```
</CodeGroup>

***

<Check>We have now setup the SDK and iFrame.</Check>


# Installation
Source: https://dev.whop.com/sdk/installation

Getting started developing an App on Whop

We recommend you use our TS SDK to build your app. It's a wrapper around our GraphQL API. We have hand-crafted SDK functions that make it easy to use our API.

<CodeGroup>
  ```bash pnpm
  pnpm install @whop/api && pnpm install -D @whop-apps/dev-proxy
  ```

  ```bash npm
  npm install @whop/api && npm install -D @whop-apps/dev-proxy
  ```

  ```bash yarn
  yarn add @whop/api && yarn add -D @whop-apps/dev-proxy
  ```
</CodeGroup>

***


# Local development
Source: https://dev.whop.com/sdk/local-development

Run your local setup inside of a Whop iFrame with the Whop proxy

If you are building a Whop app inside of our website, you can use this proxy to run your local setup inside of a Whop iFrame.
You can use this proxy with any application written in any language and any framework.

## NextJS / Javascript app

1. Add the proxy as a dev dependency.

<CodeGroup>
  ```bash pnpm
  pnpm add -D @whop-apps/dev-proxy
  ```

  ```bash npm
  npm install -D @whop-apps/dev-proxy
  ```

  ```bash yarn
  yarn add -D @whop-apps/dev-proxy
  ```
</CodeGroup>

2. Update your `package.json` dev script to include the proxy.

```json
"scripts": {
	"dev": "whop-proxy --command 'next dev --turbopack'",
}
```

> You can update the dev command to match your framework requirements.
> You can also other commands wrapped by the proxy in a similar way.

3. Run the proxy.

<CodeGroup>
  ```bash pnpm
  pnpm dev
  ```

  ```bash npm
  npm run dev
  ```

  ```bash yarn
  yarn dev
  ```
</CodeGroup>

## Standalone mode (other frameworks)

1. Run you app on your local machine on some port, for example 5000.

2. Run the proxy in standalone mode.

<CodeGroup>
  ```bash pnpm
  pnpm dlx @whop-apps/dev-proxy --standalone --upstreamPort=5000 --proxyPort=3000
  ```

  ```bash npm
  npx @whop-apps/dev-proxy --standalone --upstreamPort=5000 --proxyPort=3000
  ```

  ```bash yarn
  yarn dlx @whop-apps/dev-proxy --standalone --upstreamPort=5000 --proxyPort=3000
  ```
</CodeGroup>

<Note>
  This will run the proxy as an independent process. It will start a server on
  port 3000 and forward requests to port 5000 and append the user token in the
  headers.
</Note>

## Proxy Command Options

The proxy can be configured using the following command line options:

```bash
Usage: pnpm dlx @whop-apps/dev-proxy [options]

Options:

--proxyPort <port>      The port the proxy should listen on (3000 by default)
--upstreamPort <port>   The port the upstream server is listening on (set automatically by default)
--npmCommand <command>  The npm command to run to start the upstream server (dev by default)
--command <command>     The command to run to start the upstream server (npm run dev by default)
--standalone            Run the proxy as an independent process proxying requests from one port to another port. Ignores the command / npmCommand options.
```


# Retrieve current user
Source: https://dev.whop.com/sdk/retrieve-current-user

Retrieve the public profile information for the currently logged in user

Verify and extract the user's ID from a JWT token passed in the `x-whop-user-token` header passed to iframe apps on your backend.

<Info>
  Ensure you have [setup your whop SDK client on the
  server](/sdk/whop-api-client)
</Info>

<CodeGroup>
  ```javascript Next.js
  // app/experiences/[experienceId]/page.tsx

  import { whopSdk } from "@/lib/whop-sdk";
  import { headers } from "next/headers";

  export default async function Page() {
      const headersList = await headers(); // Get the headers from the request.

      // Extract the user ID (read from a verified auth JWT token)
      const { userId } = await whopSdk.verifyUserToken(headersList);

      // Load the user's public profile information
      const user = await whopSdk.users.getUser({ userId: userId });

      console.log(user);

      return (
        <div>
        	<h1>User</h1>
        	<pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      );

  }

  ```
</CodeGroup>

### Not using the Whop TS SDK?

<Accordion title="How to authenticate users in other languages">
  In order to retrieve the current user's ID, you need to decrypt a JWT token that is stored in the `x-whop-user-token` header. `VerifyUserToken` is a helper function in our TS SDK that decodes the JWT token and returns the user's ID.

  If are using a different framework and do not have access to the Typescript Whop SDK, you will need to implement your own JWT decoding logic. Here is an example of how to do this in Ruby on Rails:

  ```ruby Ruby on Rails
  require 'jwt'
  require 'openssl'

  # This is a static public key that is used to decode the JWT token
  # You can put this into your application
  JWT_PEM = <<~PEM.freeze
    -----BEGIN PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErz8a8vxvexHC0TLT91g7llOdDOsN
    uYiGEfic4Qhni+HMfRBuUphOh7F3k8QgwZc9UlL0AHmyYqtbhL9NuJes6w==
    -----END PUBLIC KEY-----
  PEM

  # In your request handler, extract the user token from the headers.
  user_token = request.headers["x-whop-user-token"]
  return if user_token.blank?

  # Decode and validate the JWT token.
  key = OpenSSL::PKey::EC.new(JWT_PEM)
  payload, _header = JWT.decode user_token, key, true, {
    iss: "urn:whopcom:exp-proxy",
    verify_iss: true,
    algorithm: "ES256"
  }

  # Extract your app ID from the JWT token.
  jwt_app_id = payload["aud"]

  # WARNING! You must set the WHOP_APP_ID environment variable in your application.
  # This looks like app_xxxx.
  # Validate that the JWT token is for YOUR app. (prevents someone from spoofing the user ID by passing a JWT token for a different app)
  return if jwt_app_id != ENV.fetch("WHOP_APP_ID")

  # Extract the user ID from the JWT token.
  jwt_user_id = payload["sub"]
  ```
</Accordion>


# Validate access
Source: https://dev.whop.com/sdk/validate-access

Use this API to ensure users have access to use your app

Validate access to an embedded web app:

<CodeGroup>
  ```javascript Next.js
  import { whopSdk } from "@/lib/whop-sdk";
  import { headers } from "next/headers";

  // The headers contains the user token
  const headersList = await headers();

  // The experienceId is a path param
  // This can be configured in the Whop Dashboard, when you define your app
  const { experienceId } = await params;

  // The user token is in the headers
  const { userId } = await whopSdk.verifyUserToken(headersList);

  const result = await whopSdk.access.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  if (!result.hasAccess) {
    return <div>You do not have access to this experience</div>;
  }

  // Either: 'admin' | 'customer' | 'no_access';
  // 'admin' means the user is an admin of the whop, such as an owner or moderator
  // 'customer' means the user is a common member in this whop
  // 'no_access' means the user does not have access to the whop
  const { accessLevel } = result;

  if (accessLevel === "admin") {
    return <div>You are an admin of this experience</div>;
  }

  if (accessLevel === "customer") {
    return <div>You are a customer of this experience</div>;
  }

  return <div>You do not have access to this experience</div>;
  ```
</CodeGroup>


# Set up the API client
Source: https://dev.whop.com/sdk/whop-api-client

We provide a TS client that makes it super easy to use our API. We highly recommend you use this client.

Our SDK makes it simple to use our API. It's a wrapper around our GraphQL API with pre-built functions for all of our endpoints. The endpoints are outlined in the SDK reference section of our docs.

### Install

<CodeGroup>
  ```bash pnpm
  pnpm add @whop/api
  ```

  ```bash npm
  npm install @whop/api
  ```

  ```bash yarn
  yarn add @whop/api
  ```
</CodeGroup>

### Setup your client

Create a new file that instantiates the client and exports it. We recommend putting this file at `lib/whop-sdk.ts`.

This file reads your ENV keys, which can be found on your app developer page on the Whop dashboard.

```ts
import { WhopServerSdk, makeUserTokenVerifier } from "@whop/api";

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
```

### Example usage

The rest of the examples in this section will use this client and import it from `lib/whop-sdk.ts`.

Here is an example

```ts
import { whopSdk } from "./lib/whop-sdk";

const user = await whopSdk.users.getCurrentUser();
```


# null
Source: https://dev.whop.com/tutorials



Welcome to Whop's tutorials section! Here you'll find detailed, step-by-step guides to help you build various types of applications using Whop's API.

## Getting Started

More tutorials coming soon! Check back regularly for new content.

<CardGroup cols={2}>
  <Card title="Sell an AI image generator to creators" href="/tutorials/ai-image-generator" icon="webhook" color="#8b5cf6">
    Build a ChatGPT-powered image generator and creators will be able to install it to their whops.
  </Card>

  <Card title="Build a chat bot agent" href="/tutorials/chat-bot" icon="robot" color="#0ea5e9">
    Learn how to build an AI chatbot that can respond to DMs using Whop's API.
  </Card>

  <Card title="Sell an AI car customizer" icon="car" color="#16a34a" href="/tutorials/ai-car-customizer">
    Build an app to customize cars with AI. Charge users to customize their cars.
  </Card>

  <Card title="Build a creator led betting game" href="https://www.youtube.com/watch?v=-zKMt3a8GJ4" icon="video" color="#16a34a" img="https://i.ytimg.com/vi/-zKMt3a8GJ4/maxresdefault.jpg">
    Watch an end to end tutorial on how to build a creator led betting game with Next.js and Whop APIs.
  </Card>
</CardGroup>


# AI car customizer
Source: https://dev.whop.com/tutorials/ai-car-customizer

Build a GPT-powered car modification app and creators will be able to install it to their whops

<Tip>
  This tutorial was submitted by
  [@AbdullahZHD](https://whop.com/@abdullahzahid), a member of the Whop
  Developers community. [Submit your own tutorial](https://whop.com/developer)
  and get paid real \$!
</Tip>

## Summary

This tutorial will guide you through building a car modification AI app using Next.js, Shadcn UI, and OpenAI.

View the final product [here](https://whop.com/apps/app_S42iB0COVVUVwO/install/) by installing the app to your whop.

## 1. Set up your Next.js project

Clone the Car Modification AI repository:

```bash
git clone https://github.com/AbdullahZHD/car-modification-ai-whop
cd car-modification-ai-whop
```

Install dependencies:

<CodeGroup>
  ```bash pnpm
  pnpm i
  ```

  ```bash npm
  npm i
  ```

  ```bash yarn
  yarn i
  ```
</CodeGroup>

## 2. Get your Whop API credentials

<Steps>
  <Step title="Create a Whop App">
    1. Go to [https://whop.com/dashboard](https://whop.com/dashboard)
    2. Navigate to **Developer**
    3. Click the **Create App** button
    4. Give your app a name like "Car Modification AI"
    5. Click **Create**
  </Step>

  <Step title="Get your API Key, Agent User ID, and App ID">
    After creating your app:

    1. Copy the **App API Key** - you'll need this for `WHOP_API_KEY`
    2. Copy the **Agent User ID** - you'll need this for `WHOP_AGENT_USER_ID`
    3. Copy the **App ID** - you'll need this for `WHOP_APP_ID`

    <Note>
      The Agent User ID is what allows your app's agent to send post the results in forum.
    </Note>
  </Step>
</Steps>

## 3. Get OpenAI API Key

<Steps>
  <Step title="Create OpenAI Account">
    1. Go to [platform.openai.com](https://platform.openai.com/)
    2. Click **Sign In** or **Sign Up**
    3. Complete the registration process
  </Step>

  <Step title="Get API Key">
    1. Go to **API Keys** in the dashboard
    2. Click **Create Key**
    3. Give it a name like **"Car Modification AI"**
    4. Copy the API key - you'll need this for `OPENAI_API_KEY` (ensure you have balance/payment method)
  </Step>
</Steps>

## 5. Configure Environment Variables

<Steps>
  <Step title="Create local environment file">
    ```bash
    touch .env.local
    ```
  </Step>

  <Step title="Fill in Required Variables">
    Open `.env` in your text editor and fill in these required fields:

    ```env
    # AI Service Configuration (Required)
    OPENAI_API_KEY=your_openai_api_key

    # Whop Integration (Required)
    WHOP_API_KEY=your_whop_api_key_here
    NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_whop_agent_user_id_here
    NEXT_PUBLIC_WHOP_APP_ID=your_whop_app_id_here
    ```
  </Step>
</Steps>

## 7. Install Whop Dev Proxy

For Whop integration to work in development, you need to install the Whop dev proxy globally:

```bash
npm install @whop-apps/dev-proxy -g
```

<Note>
  The Whop dev proxy is required for the iframe integration to work properly
  during development.
</Note>

## 8. Run the Application

**Lets start the Web Server with Whop Proxy**.
Run this command to start both the Whop proxy and Next.js development server:

```bash
whop-proxy --command 'npx next dev --turbopack'
```

You should see output indicating both the proxy and Next.js are running. The web app will be available at [http://localhost:3000](http://localhost:3000)

{" "}

<Warning>
  Do NOT use `npm run dev` alone - it won't include the Whop proxy and the
  iframe integration won't work!
</Warning>

## 9. Configure App Settings in Whop

**Important**: You must configure these settings BEFORE installing the app to your community.

<Steps>
  <Step title="Set Base URL and App Path">
    1. Go to your Whop app dashboard → **Developer** → Your App
    2. In the **Hosting** section, configure:
       * **Base URL**: `http://localhost:3000/`
       * **App path**: `/experiences/[experienceId]`
    3. Click **Save** to update the settings

    <Warning>
      If you skip this step, the app installation and iframe integration won't work properly!
    </Warning>
  </Step>
</Steps>

## 10. Accessing the app (locally)

<Steps>
  <Step title="Access the application via Whop iframe">
    1. After installing the app, click **Open Whop** in the top right 2. When
       redirected to Whop, click the **Settings** button 3. Change the dropdown
       from **Production** to **Localhost** 4. Choose your port (usually **3000**)
    2. You'll now see the app running in Localhost.
  </Step>
</Steps>

## 11. Deploy to Vercel

Now let's deploy your car modification AI app to production so users can access it from anywhere.

**Push your code to GitHub**

First, commit all your changes and push to GitHub:

```bash
git add .
git commit -m "Complete car modification AI app"
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

**Create and deploy on Vercel**

<Steps>
  <Step title="Create a new project on Vercel">
    Go to [vercel.com](https://vercel.com) and click "New Project"
  </Step>

  <Step title="Import your GitHub repository">
    Connect your GitHub account and import the repository containing your car
    modification app
  </Step>

  <Step title="Add environment variables">
    In the Vercel deployment settings, add all your environment variables:

    ```env
    # AI Service Configuration (Required)
    OPENAI_API_KEY=your_openai_api_key

    # Whop Integration (Required)
    WHOP_API_KEY=your_whop_api_key_here
    NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_whop_agent_user_id_here
    NEXT_PUBLIC_WHOP_APP_ID=your_whop_app_id_here
    ```
  </Step>

  <Step title="Deploy">Click "Deploy" and wait for the build to complete</Step>

  <Step title="Copy your Vercel URL">
    Once deployed, copy your production URL (e.g., `https://your-app.vercel.app`)
  </Step>
</Steps>

**Update your Whop app settings**

<Steps>
  <Step title="Open Whop Developer Settings">
    Go to Whop dashboard and navigate to your app's settings in the developer panel
  </Step>

  <Step title="Update Base URL">
    In the "App Settings" section, change the Base URL from
    `http://localhost:3000` to your Vercel URL: `https://your-app.vercel.app`
  </Step>

  <Step title="Save and test">
    Save the changes and test your app installation to ensure production mode is working (by switching to **Production** in the iframe)
  </Step>
</Steps>

<Warning>
  **Vercel Timeout Limitation**: Vercel functions automatically timeout after 60
  seconds on a hobby account. AI image generation might take longer than 60
  seconds, which may cause errors. You can upgrade to a paid Vercel account to
  extend timeout limits.
</Warning>

## 12. Install to Your Whop Community

<Steps>
  <Step title="Install the App">
    1. Go to your Whop company dashboard 2. Navigate to **Settings** → **API
       keys** 3. Click on your Car Modification AI app (or whatever name you gave
       it) 4. Find and copy the **Installation Link** 5. Visit the installation
       link and grant the necessary permissions
  </Step>
</Steps>

## Troubleshooting

<AccordionGroup>
  <Accordion title="AI responses not working">
    1. Verify your OpenAI API key is correct
    2. Verify you have balance in the OpenAI Developer account
  </Accordion>

  {" "}

  <Accordion title="Expected car modification not happening">
    1. Ensure you use a high quality image with a car in it 2. Use a clear prompt,
       such as "add a spoiler to this car"
  </Accordion>

  <Accordion title="Can't access in Localhost">
    1. Make sure you're using the Whop iframe method
    2. Ensure you've set the environment to localhost with correct port
    3. Check that your Whop App API key is correct, and all other environment variables as well
  </Accordion>
</AccordionGroup>

## Need Help?

* Join the [Developer Whop](https://whop.com/developers)
* View the source code of this app [here](https://github.com/AbdullahZHD/car-modification-ai-whop)
* DM [@AbdullahZHD on Whop](https://whop.com/@abdullahzahid)

***


# AI image generator
Source: https://dev.whop.com/tutorials/ai-image-generator

Build a ChatGPT-powered image generator and creators will be able to install it to their whops.

<Tip>
  This tutorial was submitted by [@s](https://whop.com/@s), a member of the Whop
  Developers community. [Submit your own tutorial](https://whop.com/developer)
  and get paid real \$!
</Tip>

## Summary

This tutorial will guide you through building a ChatGPT-powered image generator using Next.js, Shadcn UI, and OpenAI.

View the final product [here](https://whop.com/apps/app_KHqcozSfEGNyhl/install/) by installing the app to your whop.

## 1. Set up your Next.js project

Clone our Next.js app template:

```bash
npx create-next-app@latest ai-image-generator -e https://github.com/whopio/whop-nextjs-app-template
```

Enter the project directory:

```bash
cd ai-image-generator
```

Install dependencies:

<CodeGroup>
  ```bash pnpm
  pnpm i
  ```

  ```bash npm
  npm i
  ```

  ```bash yarn
  yarn i
  ```
</CodeGroup>

Run the app locally:

<CodeGroup>
  ```bash pnpm
  pnpm dev
  ```

  ```bash npm
  npm run dev
  ```

  ```bash yarn
  yarn dev
  ```
</CodeGroup>

Now open [http://localhost:3000](http://localhost:3000) and follow the directions on the page.

## 2. Start developing your app

After following the instructions on the page, you'll be able to start developing your app. You should have:

* Created your app
* Set up your `.env.local` file
* Installed your app into your whop

Ensure you're developing in `localhost` mode. See example:

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/whop/how-to-videos/change-to-localhost-mode.gif" alt="How to change to localhost mode" />
</Frame>

## 3. Set up your database

### Create a Supabase database

Go to [Supabase](https://supabase.com) and create a new account if you don't have one

Create a new project and copy your database password

### Set up Prisma

Now, let's set up Prisma in your project:

<CodeGroup>
  ```bash pnpm
  pnpm add prisma @prisma/client
  pnpm prisma init
  ```

  ```bash npm
  npm install prisma @prisma/client
  npx prisma init
  ```

  ```bash yarn
  yarn add prisma @prisma/client
  yarn prisma init
  ```
</CodeGroup>

The `prisma init` command will create a new `prisma` directory with a `schema.prisma` file

Now, go copy your database connection strings from Supabase for Prisma to use. Then paste the values in your `.env.local` file.

Replace your password with `[YOUR-PASSWORD]`

<Frame>
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/whop/how-to-videos/prisma-setup.gif" alt="How to setup Prisma with Supabase" />
</Frame>

Replace the contents of `prisma/schema.prisma` with:

```prisma prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Experience {
  id           String @unique
  prompt       String
}
```

Now generate your database and Prisma client:

> These are custom scripts we defined in the package.json file to load your env from .env.local and run the prisma commands. If you want to use the native prisma CLI, you'll need to move your `.env.local` to `.env` and run the commands manually.

<CodeGroup>
  ```bash pnpm
  pnpm prisma:generate
  pnpm prisma:db:push
  ```

  ```bash npm
  npm run prisma:generate
  npm run prisma:db push
  ```

  ```bash yarn
  yarn prisma:generate
  yarn prisma:db:push
  ```
</CodeGroup>

## 4. Install additional dependencies

### Add the required packages

<CodeGroup>
  ```bash pnpm
  pnpm add openai sharp react-dropzone @radix-ui/react-slot gsap
  ```

  ```bash npm
  npm install openai sharp react-dropzone @radix-ui/react-slot gsap
  ```

  ```bash yarn
  yarn add openai sharp react-dropzone @radix-ui/react-slot gsap
  ```
</CodeGroup>

### Install a Shadcn button

<CodeGroup>
  ```bash pnpm
  pnpm dlx shadcn@latest add button
  ```

  ```bash npm
  npx shadcn@latest add button
  ```

  ```bash yarn
  yarn shadcn@latest add button
  ```
</CodeGroup>

### Add your OpenAI API key

Add to your `.env.local`:

```env .env.local
# OpenAI API Key for image generation
OPENAI_API_KEY=your_openai_api_key_here
```

## 5. Create components

### `<ImageUploader>`

This component handles image upload and generation.

```typescript app/components/image-uploader.tsx [expandable]
"use client";

import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

gsap.registerPlugin(DrawSVGPlugin);

function Loader() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const mid = gsap.utils.toArray("#mid *").reverse();

    const fatTl = gsap.timeline();
    fatTl.fromTo(
      "#fat *",
      {
        drawSVG: "0% 20%",
      },
      {
        drawSVG: "40% 69%",
        stagger: {
          each: 0.05,
          repeat: -1,
          yoyo: true,
        },
        duration: 0.75,
        ease: "sine.inOut",
      }
    );

    const midTl = gsap.timeline();
    midTl.fromTo(
      mid,
      {
        drawSVG: "0% 20%",
      },
      {
        drawSVG: "56% 86%",
        stagger: {
          each: 0.08,
          repeat: -1,
          yoyo: true,
        },
        duration: 0.81,
        ease: "sine.inOut",
      }
    );

    const thinTl = gsap.timeline();
    thinTl.fromTo(
      "#thin *",
      {
        drawSVG: "20% 51%",
      },
      {
        drawSVG: "40% 80%",
        stagger: {
          each: 0.092,
          repeat: -1,
          yoyo: true,
        },
        duration: 1.4,
        ease: "sine.inOut",
      }
    );

    const mainTl = gsap.timeline();
    mainTl.add([fatTl, midTl, thinTl], 0);

    return () => {
      mainTl.kill();
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        id="mainSVG"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        className="w-100 h-100"
        role="img"
        aria-label="Loading animation"
      >
        <title>Loading animation</title>

        <linearGradient
          id="grad1"
          x1="393.05"
          y1="400"
          x2="393.05"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#3D28F7" />

          <stop offset="1" stopColor="#FF3C20" />
        </linearGradient>

        <linearGradient
          id="grad2"
          x1="393.05"
          y1="391.01"
          x2="393.05"
          y2="247.71"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#F72785" />

          <stop offset="1" stopColor="#FFEE2A" />
        </linearGradient>

        <linearGradient
          id="grad3"
          x1="393.05"
          y1="400"
          x2="393.05"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF6820" />

          <stop offset="1" stopColor="#D1FE21" />
        </linearGradient>

        <linearGradient
          id="grad4"
          x1="393.05"
          y1="400"
          x2="393.05"
          y2="250"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#35AAF9" />

          <stop offset="1" stopColor="#993BDC" />
        </linearGradient>

        <g>
          <g
            id="bg"
            stroke="url(#grad3)"
            fill="none"
            strokeLinecap="round"
            strokeMiterlimit="10"
          >
            <path d="M594.5,250v-.29L594.6,350" />

            <line x1="580.5" y1="390" x2="580.32" y2="210" />

            <line x1="565.5" y1="415" x2="565.28" y2="185" />

            <line x1="550.5" y1="434" x2="550.24" y2="166" />

            <line x1="535.5" y1="449" x2="535.22" y2="151" />

            <line x1="520.5" y1="462" x2="520.2" y2="138" />

            <line x1="505.5" y1="472" x2="505.18" y2="128" />

            <line x1="490.5" y1="480" x2="490.16" y2="120" />

            <line x1="475.5" y1="487" x2="475.14" y2="113" />

            <line x1="460.5" y1="492" x2="460.14" y2="108" />

            <line x1="445.5" y1="496" x2="445.12" y2="104" />

            <line x1="430.5" y1="499" x2="430.12" y2="101" />

            <line x1="415.5" y1="501" x2="415.12" y2="99" />

            <line x1="400.5" y1="501" x2="400.12" y2="99" />

            <line x1="385.5" y1="501" x2="385.12" y2="99" />

            <line x1="370.5" y1="499" x2="370.12" y2="101" />

            <line x1="355.5" y1="496" x2="355.12" y2="104" />

            <line x1="340.5" y1="492" x2="340.14" y2="108" />

            <line x1="325.5" y1="487" x2="325.14" y2="113" />

            <line x1="310.5" y1="480" x2="310.16" y2="120" />

            <line x1="295.5" y1="472" x2="295.18" y2="128" />

            <line x1="280.5" y1="462" x2="280.2" y2="138" />

            <line x1="265.5" y1="449" x2="265.22" y2="151" />

            <line x1="250.5" y1="434" x2="250.24" y2="166" />

            <line x1="235.5" y1="415" x2="235.28" y2="185" />

            <line x1="220.5" y1="390" x2="220.32" y2="210" />

            <polyline points="204.5 250 204.5 350.29 204.5 350" />
          </g>

          <g
            id="thin"
            stroke="url(#grad1)"
            fill="none"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          >
            <path d="M594.6,350l-.1-100.29V250" />

            <line x1="580.5" y1="390" x2="580.32" y2="210" />

            <line x1="565.5" y1="415" x2="565.28" y2="185" />

            <line x1="550.5" y1="434" x2="550.24" y2="166" />

            <line x1="535.5" y1="449" x2="535.22" y2="151" />

            <line x1="520.5" y1="462" x2="520.2" y2="138" />

            <line x1="505.5" y1="472" x2="505.18" y2="128" />

            <line x1="490.5" y1="480" x2="490.16" y2="120" />

            <line x1="475.5" y1="487" x2="475.14" y2="113" />

            <line x1="460.5" y1="492" x2="460.14" y2="108" />

            <line x1="445.5" y1="496" x2="445.12" y2="104" />

            <line x1="430.5" y1="499" x2="430.12" y2="101" />

            <line x1="415.5" y1="501" x2="415.12" y2="99" />

            <line x1="400.5" y1="501" x2="400.12" y2="99" />

            <line x1="385.5" y1="501" x2="385.12" y2="99" />

            <line x1="370.5" y1="499" x2="370.12" y2="101" />

            <line x1="355.5" y1="496" x2="355.12" y2="104" />

            <line x1="340.5" y1="492" x2="340.14" y2="108" />

            <line x1="325.5" y1="487" x2="325.14" y2="113" />

            <line x1="310.5" y1="480" x2="310.16" y2="120" />

            <line x1="295.5" y1="472" x2="295.18" y2="128" />

            <line x1="280.5" y1="462" x2="280.2" y2="138" />

            <line x1="265.5" y1="449" x2="265.22" y2="151" />

            <line x1="250.5" y1="434" x2="250.24" y2="166" />

            <line x1="235.5" y1="415" x2="235.28" y2="185" />

            <line x1="220.5" y1="390" x2="220.32" y2="210" />

            <polyline points="204.5 350 204.5 350.29 204.5 250" />
          </g>

          <g
            id="mid"
            stroke="url(#grad2)"
            fill="none"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="4"
          >
            <path d="M594.6,350l-.1-100.29V250" />

            <line x1="580.5" y1="390" x2="580.32" y2="210" />

            <line x1="565.5" y1="415" x2="565.28" y2="185" />

            <line x1="550.5" y1="434" x2="550.24" y2="166" />

            <line x1="535.5" y1="449" x2="535.22" y2="151" />

            <line x1="520.5" y1="462" x2="520.2" y2="138" />

            <line x1="505.5" y1="472" x2="505.18" y2="128" />

            <line x1="490.5" y1="480" x2="490.16" y2="120" />

            <line x1="475.5" y1="487" x2="475.14" y2="113" />

            <line x1="460.5" y1="492" x2="460.14" y2="108" />

            <line x1="445.5" y1="496" x2="445.12" y2="104" />

            <line x1="430.5" y1="499" x2="430.12" y2="101" />

            <line x1="415.5" y1="501" x2="415.12" y2="99" />

            <line x1="400.5" y1="501" x2="400.12" y2="99" />

            <line x1="385.5" y1="501" x2="385.12" y2="99" />

            <line x1="370.5" y1="499" x2="370.12" y2="101" />

            <line x1="355.5" y1="496" x2="355.12" y2="104" />

            <line x1="340.5" y1="492" x2="340.14" y2="108" />

            <line x1="325.5" y1="487" x2="325.14" y2="113" />

            <line x1="310.5" y1="480" x2="310.16" y2="120" />

            <line x1="295.5" y1="472" x2="295.18" y2="128" />

            <line x1="280.5" y1="462" x2="280.2" y2="138" />

            <line x1="265.5" y1="449" x2="265.22" y2="151" />

            <line x1="250.5" y1="434" x2="250.24" y2="166" />

            <line x1="235.5" y1="415" x2="235.28" y2="185" />

            <line x1="220.5" y1="390" x2="220.32" y2="210" />

            <polyline points="204.5 350 204.5 350.29 204.5 250" />
          </g>

          <g
            id="fat"
            stroke="url(#grad4)"
            fill="none"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="7"
          >
            <path d="M594.6,350l-.1-100.29V250" />

            <line x1="580.5" y1="390" x2="580.32" y2="210" />

            <line x1="565.5" y1="415" x2="565.28" y2="185" />

            <line x1="550.5" y1="434" x2="550.24" y2="166" />

            <line x1="535.5" y1="449" x2="535.22" y2="151" />

            <line x1="520.5" y1="462" x2="520.2" y2="138" />

            <line x1="505.5" y1="472" x2="505.18" y2="128" />

            <line x1="490.5" y1="480" x2="490.16" y2="120" />

            <line x1="475.5" y1="487" x2="475.14" y2="113" />

            <line x1="460.5" y1="492" x2="460.14" y2="108" />

            <line x1="445.5" y1="496" x2="445.12" y2="104" />

            <line x1="430.5" y1="499" x2="430.12" y2="101" />

            <line x1="415.5" y1="501" x2="415.12" y2="99" />

            <line x1="400.5" y1="501" x2="400.12" y2="99" />

            <line x1="385.5" y1="501" x2="385.12" y2="99" />

            <line x1="370.5" y1="499" x2="370.12" y2="101" />

            <line x1="355.5" y1="496" x2="355.12" y2="104" />

            <line x1="340.5" y1="492" x2="340.14" y2="108" />

            <line x1="325.5" y1="487" x2="325.14" y2="113" />

            <line x1="310.5" y1="480" x2="310.16" y2="120" />

            <line x1="295.5" y1="472" x2="295.18" y2="128" />

            <line x1="280.5" y1="462" x2="280.2" y2="138" />

            <line x1="265.5" y1="449" x2="265.22" y2="151" />

            <line x1="250.5" y1="434" x2="250.24" y2="166" />

            <line x1="235.5" y1="415" x2="235.28" y2="185" />

            <line x1="220.5" y1="390" x2="220.32" y2="210" />

            <polyline points="204.5 350 204.5 350.29 204.5 250" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function ImageUploader({
  experienceId,
}: {
  experienceId: string;
}) {
  const [image, setImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Clean up the object URL when the image is changed
  useEffect(() => {
    const objectUrl = image?.preview;
    if (objectUrl) {
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [image?.preview]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!image) return;
    try {
      const response = await fetch(
        `/api/experiences/${experienceId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: image.file,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setIsGenerating(true);
    setUploadProgress(0);
    try {
      await handleUpload();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setUploadProgress(0);
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 space-y-8">
        <div className="w-full aspect-square flex items-center justify-center">
          <Loader />
        </div>
        <div className="flex gap-4">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button disabled className="flex-1">
            Generating...
          </Button>
        </div>
      </div>
    );
  }

  const displayImage = generatedImage || image?.preview;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
      >
        <input {...getInputProps()} capture="environment" />
        {displayImage ? (
          <div className="relative w-full aspect-square">
            <Image
              src={displayImage}
              alt="Uploaded image"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📸</div>
            <p className="text-gray-600">
              {isDragActive
                ? "Drop the image here..."
                : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, GIF</p>
          </div>
        )}
      </div>

      {image && (
        <div className="flex flex-col gap-4">
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset
            </Button>
            <Button onClick={handleGenerate} className="flex-1">
              Generate Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### `<ExperiencePrompt>`

This component displays the experience prompt and image uploader.

```typescript app/components/experience-prompt.tsx [expandable]
import type { AccessLevel } from "@whop/api";
import Link from "next/link";
import ImageUploader from "./image-uploader";
import { Button } from "./ui/button";

export default function ExperiencePrompt({
  prompt,
  accessLevel,
  experienceId,
}: {
  prompt: string;
  accessLevel: AccessLevel;
  experienceId: string;
}) {
  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="text-4xl font-bold text-center">
          {prompt ? `"${prompt}"` : "Creator has not set a prompt yet."}
        </div>
      </div>
      {accessLevel === "admin" && (
        <div className="flex justify-center items-center">
          <Link href={`/experiences/${experienceId}/edit`}>
            <Button variant={"link"}>Edit prompt</Button>
          </Link>
        </div>
      )}
      {prompt ? <ImageUploader experienceId={experienceId} /> : null}
    </div>
  );
}
```

### `<EditExperiencePrompt>`

This component allows admins to edit the experience prompt.

```typescript app/components/edit-experience-prompt.tsx [expandable]
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function EditExperiencePage({
  experienceId,
}: {
  experienceId: string;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/experiences/${experienceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to update experience");
      }

      router.push(`/experiences/${experienceId}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating experience:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Prompt</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a new prompt here..."
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
```

## 6. Create pages

### `app/experiences/[experienceId]/page.tsx`

This page displays the experience prompt and the image uploader. If the user is an admin, they can edit the prompt.

```typescript app/experiences/[experienceId]/page.tsx [expandable]
import ExperiencePrompt from "@/components/experience-prompt";
import { whopSdk } from "@/lib/whop-sdk";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

async function findOrCreateExperience(experienceId: string) {
  let experience = await prisma.experience.findUnique({
    where: { id: experienceId },
  });

  if (!experience) {
    experience = await prisma.experience.create({
      data: {
        id: experienceId,
        prompt: "",
      },
    });
  }

  return experience;
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const headersList = await headers();
  const { userId } = await whopSdk.verifyUserToken(headersList);

  const { experienceId } = await params;
  const experience = await findOrCreateExperience(experienceId);

  const hasAccess = await whopSdk.access.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  return (
    <div className="flex flex-col gap-4 p-4 h-screen items-center justify-center">
      <ExperiencePrompt
        prompt={experience.prompt}
        accessLevel={hasAccess.accessLevel}
        experienceId={experienceId}
      />
    </div>
  );
}
```

### `app/experiences/[experienceId]/edit/page.tsx`

This page allows admins to edit the experience prompt.

```typescript app/experiences/[experienceId]/edit/page.tsx [expandable]
import EditExperiencePrompt from "@/components/edit-experience-prompt";

export default async function Page({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  return <EditExperiencePrompt experienceId={experienceId} />;
}
```

## 7. Create the API routes

### `app/api/experiences/[experienceId]/generate/route.ts`

This API route generates images using OpenAI's DALL-E API.

```typescript app/api/experiences/[experienceId]/generate/route.ts [expandable]
import { whopSdk } from "@/lib/whop-sdk";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import sharp from "sharp";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ experienceId: string }> }
) {
  try {
    const { experienceId } = await params;

    if (!experienceId) {
      return NextResponse.json(
        { error: "Missing experienceId" },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);
    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await whopSdk.access.checkIfUserHasAccessToExperience({
      userId: userToken.userId,
      experienceId,
    });

    if (!hasAccess.hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized, no access" },
        { status: 401 }
      );
    }

    const [publicUser, experience] = await Promise.all([
      whopSdk.users.getUser({
        userId: userToken.userId,
      }),
      prisma.experience.findUnique({
        where: {
          id: experienceId,
        },
      }),
    ]);

    if (!request.body || !experience?.prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    const originalFile = new File(
      [
        await sharp(await request.clone().arrayBuffer())
          .png()
          .toBuffer(),
      ],
      `${Date.now()}-original.png`,
      {
        type: "image/png",
      }
    );

    // Generate image using DALL-E with prompt
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: originalFile,
      prompt: experience.prompt,
      n: 1,
      size: "auto",
      quality: "low",
    });

    console.log("Response:", response);

    // Get the base64 image data from the response
    const base64Image = response.data?.[0]?.b64_json;
    if (!base64Image) {
      throw new Error("No image data returned from OpenAI");
    }
    const generatedImageBuffer = Buffer.from(base64Image, "base64");

    const generationId = crypto.randomUUID();

    const [originalFileUploadResponse, uploadResponse] = await Promise.all([
      whopSdk.attachments.uploadAttachment({
        file: originalFile,
        record: "forum_post",
      }),
      whopSdk.attachments.uploadAttachment({
        file: new File(
          [generatedImageBuffer],
          `${generationId}-generated.png`,
          {
            type: "image/png",
          }
        ),
        record: "forum_post",
      }),
    ]);

    const whopExperience = await whopSdk.experiences.getExperience({
      experienceId,
    });
    const companyId = whopExperience.experience.company.id;

    const generatedAttachmentId = uploadResponse.directUploadId;
    const originalAttachmentId = originalFileUploadResponse.directUploadId;

    const forum = await whopSdk.forums.findOrCreateForum({
      experienceId: experience.id,
      name: "AI Uploads",
    });

    const forumId = forum.createForum?.id;

    const post = await whopSdk.forums.createForumPost({
      forumExperienceId: forumId,
      content: `@${publicUser.publicUser?.username} generated this image with the prompt: "${experience.prompt}"\n\nTry it yourself here: https://whop.com/hub/${companyId}/${experience.id}/app\n\nBefore vs After ⬇️`,
      attachments: [
        { directUploadId: originalAttachmentId },
        { directUploadId: generatedAttachmentId },
      ],
    });

    return NextResponse.json({
      success: true,
      imageUrl: uploadResponse.attachment.source.url,
      postId: post?.id,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
```

### `app/api/experiences/[experienceId]/route.ts`

This API route is a PUT operation to an experience in the database.

```typescript app/api/experiences/[experienceId]/route.ts [expandable]
import { whopSdk } from "@/lib/whop-sdk";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request) {
  try {
    const { prompt } = await request.json();
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);
    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(request.url);
    const match = url.pathname.match(/experiences\/([^/]+)/);
    const experienceId = match ? match[1] : null;

    if (!experienceId) {
      return NextResponse.json(
        { error: "Missing experienceId" },
        { status: 400 }
      );
    }

    const hasAccess = await whopSdk.access.checkIfUserHasAccessToExperience({
      userId: userToken.userId,
      experienceId,
    });
    if (hasAccess.accessLevel !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized, not admin" },
        { status: 401 }
      );
    }

    const updatedExperience = await prisma.experience.update({
      where: {
        id: experienceId,
      },
      data: {
        prompt,
      },
    });

    await whopSdk.notifications.sendNotification({
      content: prompt,
      experienceId,
      title: "Prompt updated ✨",
    });

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}
```

## 8. Deploy to Vercel

1. Add this script to the `scripts` section of your `package.json` to generate the Prisma client:

```json package.json
  "scripts": {
    "postinstall": "prisma generate"
  }
```

2. Push your code to GitHub
3. Create a new project on [Vercel](https://vercel.com)
4. Import your GitHub repository
5. Add all environment variables
6. Deploy and copy your Vercel URL
7. Update your Whop app settings with the new URL in the "Base URL" field

> Vercel functions automatically timeout after 60 seconds on a hobby account. Images might take longer than 60 seconds. This will cause errors. You can upgrade to a paid account to avoid this or swap out the image generator to a different API.

Your AI image generation app is now ready! Users can upload images, apply AI transformations based on prompts, and share their creations in the community forum.

## Need Help?

* Join the [Developer Whop](https://whop.com/developers)
* View the source code of this app [here](https://github.com/whopio/whop-sdk-ts/tree/main/examples/ai-image-generator)
* DM [@s on Whop](https://whop.com/@s)

***


# Chat bot
Source: https://dev.whop.com/tutorials/chat-bot

Build a production-ready AI support bot that intelligently answers questions in whop communities.

<Tip>
  This tutorial was submitted by [@script](https://whop.com/@script), a member
  of the Whop Developers community. [Submit your own
  tutorial](https://whop.com/developer) and get paid real \$!
</Tip>

## Summary

This tutorial will guide you through building a chat bot that can answer questions in whop communities. View the final product
[here](https://whop.com/apps/app_3rqpGo1tsmPDHg/install/) by installing the app to your whop.

## 1. Set up your Next.js project

Clone the AI Support Bot repository:

```bash
git clone https://github.com/VortexxJS/whop-ai-support (not available yet)
cd whop-ai-bot
```

Install dependencies:

<CodeGroup>
  ```bash npm
   npm install
  ```

  ```bash pnpm
  pnpm install
  ```

  ```bash yarn
  yarn instal
  ```
</CodeGroup>

## 2. Get your Whop API credentials

<Steps>
  <Step title="Create a Whop App">
    1. Go to [https://whop.com/dashboard/developer](https://whop.com/dashboard/developer)
    2. Navigate to **Developer**
    3. Click the **Create App** button
    4. Give your app a name like "AI Support Bot"
    5. Click **Create**
  </Step>

  <Step title="Get your API Key, Agent User ID, and App ID">
    After creating your app:

    1. Copy the **App API Key** - you'll need this for `WHOP_API_KEY`
    2. Copy the **Agent User ID** - you'll need this for `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
    3. Copy the **App ID** - you'll need this for `NEXT_PUBLIC_WHOP_APP_ID`

    {" "}

    <Note>
      The Agent User ID is what allows your bot to send messages on behalf of your
      app.
    </Note>
  </Step>
</Steps>

## 3. Set up Supabase Database

<Steps>
  <Step title="Create a Supabase Project">
    1. Go to [https://supabase.com](https://supabase.com)
    2. Click **Start your project**
    3. Sign in or create an account
    4. Click **New project**
    5. Choose your organization
    6. Enter a **Database Name** (e.g., "ai-support-bot")
    7. Enter a **Database Password** (save this!)
    8. Select a **Region** close to your users
    9. Click **Create new project**
  </Step>

  <Step title="Get Database Connection Strings">
    Once your project is created:

    1. Go to **Settings** → **Database**
    2. Scroll down to **Connection string**
    3. Copy the **URI** format for `DATABASE_URL`
    4. Copy the **Direct connection** for `DIRECT_URL`

    {" "}

    <Warning>
      Replace `[YOUR-PASSWORD]` in both URLs with the database password you created.
    </Warning>
  </Step>
</Steps>

## 4. Get OpenRouter AI API Key

<Steps>
  <Step title="Create OpenRouter Account">
    1. Go to [https://openrouter.ai](https://openrouter.ai)
    2. Click **Sign In** or **Sign Up**
    3. Complete the registration process
  </Step>

  <Step title="Get API Key">
    1. Go to **Keys** in the dashboard
    2. Click **Create Key**
    3. Give it a name like "AI Support Bot"
    4. Copy the API key - you'll need this for `OPENROUTER_API_KEY`

    {" "}

    <Info>
      OpenRouter gives you \$1 free credit when you sign up, which is more than
      enough for testing with Gemini 2.0 Flash!
    </Info>
  </Step>
</Steps>

## 5. Configure Environment Variables

<Steps>
  <Step title="Copy Environment Template">
    ```bash
    cp env.example .env
    ```
  </Step>

  <Step title="Fill in Required Variables">
    Open `.env` in your text editor and fill in these required fields:

    ```env
    # Database Configuration (Required)
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
    DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"

    # AI Service Configuration (Required)
    OPENROUTER_API_KEY="your_openrouter_api_key_here"
    OPENROUTER_MODEL="google/gemini-2.0-flash-001"

    # Whop Integration (Required)
    WHOP_API_KEY="your_whop_app_api_key_here"
    NEXT_PUBLIC_WHOP_AGENT_USER_ID="your_bot_user_id_here"
    NEXT_PUBLIC_WHOP_APP_ID="your_whop_app_id_here"
    ```

    {" "}

    <Info>All other variables are optional and have sensible defaults.</Info>
  </Step>
</Steps>

## 6. Set up the Database

Push the database schema to Supabase:

```bash
npm run db:push
```

This will create the necessary tables:

* `companies` - Store bot settings for each Whop company
* `experience_mappings` - Map Whop experiences to companies

## 7. Install Whop Dev Proxy

For Whop integration to work in development, you need to install the Whop dev proxy globally:

```bash
npm install @whop-apps/dev-proxy -g
```

<Note>
  The Whop dev proxy is required for the iframe integration to work properly
  during development.
</Note>

## 8. Run the Application

<Steps>
  <Step title="Start the Web Server with Whop Proxy">
    Run this command to start both the Whop proxy and Next.js development server:

    ```bash
    whop-proxy --command 'npx next dev --turbopack'
    ```

    You should see output indicating both the proxy and Next.js are running. The web app will be available at [http://localhost:3000](http://localhost:3000)

    <Warning>
      Do NOT use `npm run dev` alone - it won't include the Whop proxy and the iframe integration won't work!
    </Warning>
  </Step>

  <Step title="Start the AI Bot (New Terminal)">
    In a new terminal window:

    ```bash
    npm run bot
    ```

    You should see:

    ```
    🚀 Starting Whop AI Bot...

    Features:
      • Smart AI question detection
      • Admin-only configuration
      • Real-time responses
      • Rate limiting & caching

    ✅ Bot connected to Whop
    🤖 Listening for messages and commands...
    ```
  </Step>
</Steps>

## 9. Configure App Settings in Whop

**Important**: You must configure these settings BEFORE installing the app to your community.

<Steps>
  <Step title="Set Base URL and App Path">
    1. Go to your Whop app dashboard → **Developer** → Your App
    2. In the **Hosting** section, configure:
       * **Base URL**: `http://localhost:3000/`
       * **App path**: `/company/[companyId]`
    3. Click **Save** to update the settings

    <Warning>
      If you skip this step, the app installation and iframe integration won't work properly!
    </Warning>
  </Step>
</Steps>

## 10. Install to Your Whop Community

1. Go to your Whop company dashboard
2. Navigate to **Settings** → **API
   keys**
3. Click on your AI Support Bot app
4. Find and copy the **Installation Link**
5. Visit the installation link and grant the necessary
   permissions

## 11. Configure Your Bot

<Steps>
  <Step title="Access Bot Settings via Whop iframe">
    1. After installing the app, click **Open Whop** in the top right
    2. When redirected to Whop, click the **Settings** button
    3. Change the dropdown from **Production** to **Localhost**
    4. Choose your port (usually **3000**)
    5. You'll now see the bot configuration dashboard

    <Note>
      Only company admins can access the bot settings page.
    </Note>
  </Step>

  <Step title="Set Up Your Bot">
    Configure these settings:

    * **Enable Bot**: Turn on the AI responses
    * **Knowledge Base**: Add information about your community
    * **Response Style**: Choose professional, friendly, casual, or technical
    * **Preset Q\&A**: Add common questions with instant answers
    * **Custom Instructions**: Fine-tune the AI's behavior
  </Step>
</Steps>

## 12. Test Your Bot

1. Go to your Whop community chat
2. Ask a question like "How do I join?"
3. The bot should respond within a few seconds

## Troubleshooting

<AccordionGroup>
  <Accordion title="Bot not responding to messages">
    1. Check that both the web server and bot are running
    2. Verify your environment variables are correct
    3. Look for errors in the bot console output
    4. Make sure the bot is enabled in the settings dashboard
  </Accordion>

  <Accordion title="Database connection errors">
    1. Verify your Supabase database URLs are correct
    2. Make sure you replaced
       `[YOUR-PASSWORD]` with your actual password
    3. Check that your Supabase
       project is active
    4. Try running `npm run db:push` again
  </Accordion>

  <Accordion title="AI responses not working">
    1. Verify your OpenRouter API key is correct
    2. Make sure the bot is enabled
    3. Verify the knowledge base is not empty
    4. Check the bot console for any
       AI-related errors
  </Accordion>

  <Accordion title="Can't access bot settings">
    1. Make sure you're using the Whop iframe method
    2. Ensure you've set the environment to localhost with correct port
    3. Verify you're a company admin in Whop
    4. Check that your Whop App API key is correct
  </Accordion>
</AccordionGroup>

## What's Next?

Your AI Support Bot is now ready! Here are some next steps:

* **Customize responses**: Add more preset Q\&A pairs for instant answers
* **Train the AI**: Update the knowledge base with community-specific information
* **Monitor usage**: Check the bot console for statistics and performance
* **Scale up**: Deploy to production using Vercel, Railway, or your preferred platform

<Note>
  The bot saves 80-90% on AI costs through smart question detection and caching.
  Perfect for high-volume communities!
</Note>

## Need Help?

* Join the [Developer Whop](https://whop.com/developer)
* View the source code of this app [here](https://github.com/AbdullahZHD/car-modification-ai-whop)
* DM [@script on Whop](https://whop.com/@script)

***


# React Native (Beta)
Source: https://dev.whop.com/tutorials/react-native

Build whop apps using React Native for fast, mobile optimized experiences.

<Info>
  The react native sdks are still in beta and we're actively working to improve
  and fix any bugs. Currently the [whop
  courses](https://whop.com/apps/app_0vPZThfBpAwLo/) app is fully powered by
  react native on both iOS and Android.
</Info>

# Getting started

Create a new app in the [dashboard](https://whop.com/dashboard/developer) and copy environment variables from the app details page.

### Create the app locally

Ensure you have at least node 22+ installed and pnpm 9.15+.
To check run `node -v` and `pnpm -v`.

```bash
pnpm create @whop/react-native@latest
```

This creates a new whop react native skeleton app. `cd` into your new folder (named after your provided app name) and install dependencies using pnpm.

```bash
cd my-app
pnpm install
```

### Edit your code

The entry point for your app is in `src/views/experience-view.tsx`.
This view will be rendered when a creator installs your app into their whop.

For example, you can render a button that will greet the current user id.

```tsx
import type { ExperienceViewProps } from "@whop/react-native";
import { Button, Alert, View } from "react-native";

export function ExperienceView(props: ExperienceViewProps) {
  function handleGreet() {
    Alert.alert(
      `Hello ${props.currentUserId}! Welcome to experience ${props.experienceId}`
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Click Me!" onPress={handleGreet} />
    </View>
  );
}
```

### Install your app

Install your new app into your whop so you can preview it on your phone.

```bash
pnpm whop-react-native install
```

Open the app from inside your whop on your iPhone and shake it.
This enables "dev mode" and allows you to see the latest 'non production' react native builds.
On android you can use the info button in the top right to toggle developer mode.

Right now, it should show an error in the bottom saying "No build found ..."

<Info>
  Developer mode can only be activated by owners and admins of the company that
  owns the app.
</Info>

### Ship it!

```bash
pnpm ship
```

The `ship` command will build and upload your app to the whop servers. You can
limit the platforms by passing either `--ios` or `--android`. From here it
will be pushed live to your phone.

<Info>
  The `ship` command will NOT push the app to existing users of your app. It is
  safe to run on existing web apps too meaning you can progressively migrate
  your app to react native.
</Info>

### Deploy to production.

Once you're happy with your app go to your [developer dashboard](https://whop.com/dashboard/developer) and click "Promote to production" on your latest development build.

After going through an automated review, the app will be pushed instantly to all users of your app on iOS and Android.

<Info>
  ProTip: the `pnpm ship` command prints out a link you can use to promote your
  app to production.
</Info>

From the builds screen you can also instant rollback to a previous production build which will be pushed live to all users across whop.

# Native Integration

The beauty of react native is its rich integration with native platform features and APIs.

The Whop app exposes a set of common powerful native building blocks your can directly use in your react native app.

Features like video playback, camera access, native gestures and animations are available already.
We plan on expanding the capabilities to allow many different kinds of apps to be built!

You can use these libraries pinned to these version:

* `react-native-nitro-modules@0.26.3`
* `react-native-video@6.16.1`
* `@d11/react-native-fast-image@8.10.0`
* `react-native-svg@15.12.0`
* `react-native-webview@13.15.0`
* `react-native-reanimated@3.18.0`
* `react-native-gesture-handler@2.27.2`
* `react-native-haptic-feedback@2.3.3`
* `react-native-vision-camera@4.7.1`
* `react-native-safe-area-context@5.5.2`

# Whop SDK

The whop sdk is available for use in the react native app out of the box. Using this you can fetch data within the scope of the current user.

<Info>
  We recommend using the `useQuery` hook from `@tanstack/react-query` to fetch
  data.
</Info>

```tsx
import { whopSdk } from "@whop/react-native";

export function MyComponent() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => whopSdk.users.getCurrentUser(),
  });

  return <Text>{user?.name}</Text>;
}
```

# Future plans

* Filesystem access
* Whop UI Kit
* Integrated router + robust deeplinking support
* More native modules
* Web Support + Hosting!
* Anything you might want. [Join the developer community!](https://whop.com/developers)

# Making authenticated requests

You can make authenticated requests to your api by using the same proxy infrastructure used for existing web apps.

1. Set your api origin as the `Base Domain` in the [developer dashboard](https://whop.com/dashboard/developer)
2. Make a normal fetch request from your react native app using the `apiOrigin` from `__internal_execSync("getAppApiOrigin", {})`

```tsx
const apiOrigin = __internal_execSync("getAppApiOrigin", {});

// Assuming your server has this api endpoint:
fetch(`${apiOrigin}/api/v1/users/me`).then((res) => res.json());
```

3. On your server use the standard `verifyUserToken` function from the SDK to verify the request. Auth between react native apps and whop iframe apps is exactly the same meaning you can *reuse* your backend.

# Color themes

React native by default exposes a `useColorScheme` hook that you can use to get the current color scheme of the device. This works correctly out of the box on whop react native apps too!.

While we are still building our UI kit, you can use the following `useColors` hook as inspiration to build your own dynamic color scheme:

```bash
# Install the radix ui colors package
pnpm i @radix-ui/colors
```

```tsx Usage
function MyComponent() {
  const colors = useColors();

  return <View style={{ backgroundColor: colors.gray1 }} />;
}
```

Hook implementation to copy:

```tsx use-colors.ts expandable
import {
  amber,
  amberA,
  amberDark,
  amberDarkA,
  blue,
  blueA,
  blueDark,
  blueDarkA,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  green,
  greenA,
  greenDark,
  greenDarkA,
  red,
  redA,
  redDark,
  redDarkA,
} from "@radix-ui/colors";
import { useColorScheme } from "react-native";

export function useColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Create all the color groups
  const _grayA = isDark ? grayDarkA : grayA;
  const _gray = isDark ? grayDark : gray;
  const _blueA = isDark ? blueDarkA : blueA;
  const _blue = isDark ? blueDark : blue;
  const _redA = isDark ? redDarkA : redA;
  const _red = isDark ? redDark : red;
  const _amberA = isDark ? amberDarkA : amberA;
  const _amber = isDark ? amberDark : amber;
  const _greenA = isDark ? greenDarkA : greenA;
  const _green = isDark ? greenDark : green;

  // Merge them
  return {
    transparent: "transparent" as const,
    ..._grayA,
    ..._gray,
    ..._blueA,
    ..._blue,
    ..._redA,
    ..._red,
    ..._amberA,
    ..._amber,
    ..._greenA,
    ..._green,
  };
}
```

# Secret internal features

We are still working on polishing our api's but if you wanna build something cool RIGHT NOW, you can use some internal api's to communicate with the whop app.

<Warning>
  These function may throw. Use within a `try {} catch (e) {}` block.
</Warning>

```tsx
import { __internal_execSync, __internal_execAsync } from "@whop/react-native";

// Example usage:
__internal_execSync("routerPush", {
  path: ["some", "second", "page"],
  params: { query: "hello" },
});
// Pro tip: the `path` and `query` is passed as a prop to the `ExperienceView`
// component. This is how multi level routing works for courses currently.

// Full list of calls and types available here:

export interface PathParams {
  path: string[];
  params: Record<string, string>;
}

export interface ExecSyncApi {
  getAppApiOrigin(params: EmptyObject): { apiOrigin: string };
  cacheGet(params: { key?: string | null }): { data?: string | null };
  cacheSet(params: { key?: string | null; data?: string | null }): EmptyObject;
  routerPush(params: PathParams): EmptyObject;
  routerPop(params: EmptyObject): EmptyObject;
  routerGetCurrent(params: EmptyObject): PathParams;
  setNavigationBarData(params: {
    title?: string | null;
    description?: string | null;
  }): EmptyObject;
  routerPresentSheet(params: PathParams): EmptyObject;
  routerDismissSheet(params: EmptyObject): EmptyObject;
  routerGetCurrentSheet(params: EmptyObject): PathParams | null | undefined;
  downgradeToWebView(params: EmptyObject): EmptyObject;
  getHostAppDetails(params: EmptyObject): {
    build: string;
    version: string;
    platform: "ios" | "android" | "web";
    buildType: "appstore" | "testflight" | "debug";
  };
}

export interface ExecAsyncApi extends ExecSyncApi {
  inAppPurchase(params: { id?: string | null; planId: string }): {
    sessionId: string;
    receiptId: string;
  };
}
```