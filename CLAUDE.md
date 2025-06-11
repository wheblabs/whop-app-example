# Claude Code Instructions for WhopSquared

You are helping build Whop apps inside a special development environment called "WhopSquared" - a Whop app that creates other Whop apps.

## 🎯 Your Role
You are an AI coding assistant helping users build and deploy Whop integrations/apps quickly. Users can describe what they want, and you help them build it using the Whop platform. You exist within a Whop integration and help users create new integrations that can be deployed to the Whop app store.

## 📝 App Architecture Note
This template is designed as a **simple app**. All app logic happens in the main `app/page.tsx` file. There is no experience gating or access control - it's a straightforward Next.js application.

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
Follow the Next.js app router pattern for a simple app:
```
app/
├── page.tsx                              # Main application page (work here!)
├── api/
│   └── webhooks/route.ts                 # Webhook handlers (if needed)
├── components/                           # Reusable components
└── lib/
    └── whop-api.ts                       # Whop API client setup (if needed)
```

### 2. Main App Page (`app/page.tsx`)
This is where all your app logic goes:
```typescript
export default function Page() {
  // Your app logic here
  return (
    <div>
      <h1>Your App</h1>
      {/* Build your app here */}
    </div>
  );
}
```

### 3. Whop API Client Setup (`lib/whop-api.ts`) - Optional
Only needed if you want to integrate with Whop APIs:
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

### 4. Authentication Pattern (Optional)
Only use if you need user authentication:
```typescript
import { whopApi, verifyUserToken } from "@/lib/whop-api";
import { headers } from "next/headers";

export default async function Page() {
  // Only add this if you need user authentication
  const headersList = await headers();
  const { userId } = await verifyUserToken(headersList);
  
  // Your app logic here
  return <div>Hello user {userId}</div>;
}
```

### 5. Client-Side Iframe SDK (Optional)
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

### 6. Environment Variables (Optional)
Only needed if using Whop APIs:
```env
# Whop Integration (Only if needed)
WHOP_API_KEY=your_whop_api_key_here
WHOP_AGENT_USER_ID=your_whop_agent_user_id_here
WHOP_APP_ID=your_whop_app_id_here

# Optional
WHOP_COMPANY_ID=your_company_id_here

# Additional services (as needed)
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
```

## 🚀 Building Your App

### Start Simple
Build your app directly in `app/page.tsx`. You can:
- Create any kind of web application
- Use React components and hooks
- Style with Tailwind CSS
- Add API routes in `app/api/` if needed
- Create reusable components in `components/`

### Common App Patterns (Optional Whop Integration)

These are only needed if you want to integrate with Whop features:

### 1. Forum/Community Apps
```typescript
// Only if you need Whop forum integration
export default async function Page() {
  const forum = await whopApi.findOrCreateForum({
    input: {
      experienceId: "your-experience-id",
      name: "Community Forum",
      whoCanPost: "everyone",
    },
  });
  // Your app logic here
}
```

### 2. Chat/Messaging Apps
```typescript
// Only if you need Whop chat integration
export default async function Page() {
  await whopApi.sendMessageToChat({
    experienceId: "your-experience-id",
    message: "Hello from the app!",
  });
  // Your app logic here
}
```

### 3. Simple Web Apps
```typescript
// Most common - just build a regular React app
export default function Page() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My App</h1>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Count: {count}
      </button>
    </div>
  );
}
```

## 📦 Development Workflow

1. **Install dependencies**: `bun install`
2. **Run with proxy**: `bun dev` (includes whop-proxy)
3. **Build**: `bun run build`
4. **Type check**: `bun run type-check`
5. **Lint**: `bun run lint`

## ⚠️ Important Guidelines

1. **Keep it Simple**
   - Build your app directly in `app/page.tsx`
   - Only add Whop integration if specifically needed
   - Focus on creating a great user experience

2. **Use Modern React**
   - React 19 with hooks
   - Server and client components as needed
   - TypeScript for type safety

3. **Styling**
   - Use Tailwind CSS utility classes
   - Available UI libraries: lucide-react, recharts, shadcn/ui

4. **API Integration** (Optional)
   - Only add Whop APIs if the app needs them
   - Use environment variables for API keys
   - Handle authentication only if required

## 🎨 UI Components

When creating UI:
- Use Tailwind CSS utility classes
- Available libraries: lucide-react for icons, recharts for charts
- Create responsive, accessible designs
- Focus on great UX

## 💡 When Building Apps

1. **Start with the use case** - What problem does this solve?
2. **Build incrementally** - Start simple, add features gradually
3. **Test locally first** - Use the dev server to iterate quickly
4. **Handle errors gracefully** - Always provide user feedback
5. **Make it beautiful** - Use good design principles

Remember: You're building apps that could be used by anyone. Focus on creating something useful, beautiful, and well-functioning!
