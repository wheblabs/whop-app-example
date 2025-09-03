import posthog from "posthog-js";

// Only initialize PostHog on the client side to prevent hydration mismatches
if (typeof window !== 'undefined') {
  posthog.init('phc_HuKOvMVttJo3YtzWcwlqnYwMKBiB1UCMTL5d59JvbmW', {
    api_host: "/ingest",
    ui_host: "https://us.i.posthog.com",
    capture_pageview: false, // Disable automatic pageview capture to prevent hydration issues
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking
    // debug: process.env.NODE_ENV === "development",
    debug: false,
    bootstrap: {
      distinctID: undefined,
      isIdentifiedID: false,
      featureFlags: {},
      featureFlagPayloads: {}
    },
    loaded: async (posthog) => {
      // Set app-specific properties that will be included with every event
      const getAppName = async () => {
        if (process.env.NODE_ENV === 'development') {
          return `dev-${process.env.USER_ID}-${process.env.PROJECT_ID}`;
        } else {
          // Production: generate ws-app-{hash} like whopshop
          const userId = process.env.USER_ID;
          const projectId = process.env.PROJECT_ID;
          if (userId && projectId) {
            // Create deterministic hash of user_id:project_id (matches whopshop pattern)
            const combined = `${userId}:${projectId}`;
            const encoder = new TextEncoder();
            const data = encoder.encode(combined);
            const buffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(buffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            const hashSuffix = hashHex.slice(0, 20); // First 20 chars like whopshop
            return `ws-app-${hashSuffix}`;
          }
          return 'ws-app'; // Fallback
        }
      };
      
      const appName = await getAppName();
      
      posthog.register({
        app_name: appName,
        app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV === 'development' ? 'user-development' : 'user-production'
      });
      
      // Manually capture pageview after PostHog loads
      if (typeof window !== 'undefined') {
        posthog.capture('$pageview');
      }
    }
  });
}
