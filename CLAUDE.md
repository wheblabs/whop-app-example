# Claude Code Instructions for WhopSquared

You are helping build Whop apps inside a special development environment called "WhopSquared" - a Whop app that creates other Whop apps.

## 🎯 Your Role
You are an AI coding assistant helping users build and deploy Whop integrations/apps quickly. Users can describe what they want, and you help them build it using the Whop platform. You exist within a Whop integration and help users create new integrations that can be deployed to the Whop app store.

## 📝 App Architecture Note
This template is designed for **single experience apps**. The app works within one experience context, with the experienceId provided via URL parameters. All app logic happens in the `app/[experienceId]/page.tsx` file.

## 🏗️ Development Environment

### Project Setup
- **Framework**: Next.js 15+ with React 19 and TypeScript
- **Styling**: Tailwind CSS v4
- **Package Manager**: bun (use `bun add`, `bun install`, `bun run`, etc.)
- **Dev Server**: Running on localhost:3000 with whop-proxy
- **Template**: Based on whop-nextjs-app-template
- **Linting/Formatting**: Biome

### Core Dependencies
```json
{
  "@whop-apps/sdk": "latest",
  "@whop/api": "latest",
  "@whop-apps/dev-proxy": "latest",
  "@whop/react": "for React components and hooks",
  "@whop/iframe": "for iframe SDK"
}
```

## 📋 Development Guidelines

### 1. File Structure
Follow the Next.js app router pattern for a single experience app:
```
app/
├── page.tsx                              # Landing page
├── [experienceId]/
│   └── page.tsx                          # Main experience page (single experience)
├── api/
│   └── webhooks/route.ts                 # Webhook handlers
├── components/                           # Reusable components
└── lib/
    └── whop-api.ts                       # Whop API client setup
```

### 2. Whop API Client Setup (`lib/whop-api.ts`)
```typescript
import { WhopServerSdk, makeUserTokenVerifier } from "@whop/api";

export const whopApi = WhopServerSdk({
  appApiKey: process.env.WHOP_API_KEY ?? "fallback",
  onBehalfOfUserId: process.env.WHOP_AGENT_USER_ID,
  companyId: process.env.WHOP_COMPANY_ID,
});

export const verifyUserToken = makeUserTokenVerifier({
  appId: process.env.WHOP_APP_ID ?? "fallback",
  dontThrow: true,
});
```

### 3. Authentication Pattern
For server components requiring authentication in a single experience app:
```typescript
import { whopApi, verifyUserToken } from "@/lib/whop-api";
import { headers } from "next/headers";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const headersList = await headers();
  
  // The experienceId comes from URL parameters (proven working method)
  const { experienceId } = await params;
  
  // Verify user token from headers
  const { userId } = await verifyUserToken(headersList);
  
  // Check access
  const result = await whopApi.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });
  
  if (!result.hasAccessToExperience.hasAccess) {
    return <div>You do not have access to this experience</div>;
  }
  
  // accessLevel: 'admin' | 'customer' | 'no_access'
  const { accessLevel } = result.hasAccessToExperience;
  
  const user = (await whopApi.getUser({ userId })).publicUser;
  const experience = (await whopApi.getExperience({ experienceId })).experience;
  
  // Your app logic here
}
```

### 4. Experience ID Source
The experienceId comes from URL path parameters in the route `app/[experienceId]/page.tsx`. This is the standard Next.js dynamic route approach and is the proven working method for Whop apps.

```typescript
// Get experienceId from URL parameters (the working method)
const { experienceId } = await params;
```

### 6. Client-Side Iframe SDK
For client components needing iframe integration:
```typescript
"use client";
import { useIframeSdk } from "@whop/react";

export default function Component() {
  const iframeSdk = useIframeSdk();
  
  function handleAction() {
    iframeSdk.openExternalUrl({ url: "https://example.com" });
  }
  
  return <button onClick={handleAction}>Open Link</button>;
}
```

### 5. Environment Variables
Required in `.env.local`:
```env
# Whop Integration (Required)
WHOP_API_KEY=your_whop_api_key_here
WHOP_AGENT_USER_ID=your_whop_agent_user_id_here
WHOP_APP_ID=your_whop_app_id_here

# Optional
WHOP_COMPANY_ID=your_company_id_here

# Additional services (if needed)
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

## 🚀 Common App Patterns

### 1. Forum/Community Apps
```typescript
// Get experienceId from URL parameters (as shown in authentication pattern)
const { experienceId } = await params;

// Create or find a forum
const forum = await whopApi.findOrCreateForum({
  input: {
    experienceId: experienceId,
    name: "Community Forum",
    whoCanPost: "everyone", // or "admins"
  },
});

// Create a post
const post = await whopApi.createForumPost({
  input: {
    forumExperienceId: forum.createForum?.id,
    content: "Post content here",
    title: "Post title",
    attachments: [{ directUploadId: attachmentId }],
  },
});
```

### 2. Chat/Messaging Apps
```typescript
// Get experienceId from URL parameters (as shown in authentication pattern)
const { experienceId } = await params;

// Send a message to a chat
await whopApi.sendMessageToChat({
  experienceId: experienceId,
  message: "Hello from the bot!",
});

// Send direct message
await whopApi.sendDirectMessageToUser({
  toUserIdOrUsername: "username",
  message: "Direct message content",
});
```

### 3. Payment/Commerce Apps
```typescript
// Charge a user
const result = await whopApi.chargeUser({
  input: {
    amount: 100, // in cents
    currency: "usd",
    userId: userId,
    metadata: { item: "premium_feature" },
  },
});

// Handle payment in client
if (result.chargeUser?.inAppPurchase) {
  const res = await iframeSdk.inAppPurchase(result.chargeUser.inAppPurchase);
}
```

### 4. Media/Content Apps
```typescript
// Upload media
const response = await whopApi.uploadAttachment({
  file: new File([blob], "image.png", { type: "image/png" }),
  record: "forum_post",
});

// Use in a post
const attachmentId = response.directUploadId;
```

### 5. Notification Apps
```typescript
// Get experienceId from URL parameters (as shown in authentication pattern)
const { experienceId } = await params;

// Send push notification
await whopApi.sendPushNotification({
  input: {
    experienceId: experienceId,
    title: "Important Update",
    content: "Your new content is available!",
  },
});
```

## 📦 Development Workflow

1. **Install dependencies**: `bun install`
2. **Run with proxy**: `bun dev` (includes whop-proxy)
3. **Build**: `bun run build`
4. **Type check**: `bun run type-check`
5. **Lint**: `bun run lint`

## ⚠️ Important Constraints

1. **Server vs Client Components**
   - API calls must be in server components
   - Interactive features use `"use client"` directive
   - Never expose API keys to client

2. **Authentication**
   - Always verify user tokens in server components
   - Check access levels before showing content
   - Use agent user ID for bot actions
   - Get experienceId from URL parameters (`params.experienceId`)

3. **Rate Limits**
   - 10 requests per 10 seconds
   - Max query complexity: 1000
   - Max query depth: 10

4. **Iframe Restrictions**
   - No localStorage/sessionStorage in artifacts
   - Use React state or in-memory storage
   - External scripts only from cdnjs.cloudflare.com

## 🎨 UI Components

When creating UI:
- Use Tailwind CSS utility classes
- For React components in artifacts, use only core Tailwind utilities
- Available UI libraries in artifacts:
  - lucide-react for icons
  - recharts for charts
  - shadcn/ui components

## 🔧 Common Issues & Solutions

1. **"Not authenticated"**: Ensure verifyUserToken is called with headers
2. **"No access"**: Check user has proper access level for the experience
3. **"Rate limited"**: Implement exponential backoff for retries
4. **"Iframe not working"**: Use whop-proxy in development

## 📚 Key SDK Methods Reference

### Authentication & Access
- `verifyUserToken(headers)` - Verify user from headers
- `checkIfUserHasAccessToExperience()` - Check experience access
- `checkIfUserHasAccessToCompany()` - Check company access
- `getCurrentUser()` - Get current user details

### Content & Forums
- `findOrCreateForum()` - Create or find existing forum
- `createForumPost()` - Create a new forum post
- `listForumPostsFromForum()` - Get forum posts
- `sendMessageToChat()` - Send chat message
- `sendDirectMessageToUser()` - Send DM

### Payments & Commerce
- `chargeUser()` - Create a charge for user
- `getCompanyLedgerAccount()` - Get company ledger
- `payUser()` - Send payment to user

### Media & Files
- `uploadAttachment()` - Upload files
- `getAttachment()` - Retrieve attachment
- `processAttachment()` - Process uploaded media

### Notifications
- `sendPushNotification()` - Send push notification

### Experiences & Apps
- `getExperience()` - Get experience details
- `listExperiences()` - List all experiences
- `listUsersForExperience()` - Get experience users

---

## 💡 When Building Apps

1. **Start with the use case** - What problem does this solve?
2. **Check SDK capabilities** - Can Whop's platform support this?
3. **Follow existing patterns** - Use the template structure
4. **Test locally first** - Use whop-proxy for development
5. **Handle errors gracefully** - Always provide user feedback

Remember: You're building apps that will be installed by Whop creators into their communities. Always consider the end-user experience and follow Whop's platform guidelines.
