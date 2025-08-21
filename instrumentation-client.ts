import posthog from "posthog-js";

// Only initialize PostHog on the client side to prevent hydration mismatches
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
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
    loaded: (posthog) => {
      // Set app-specific properties that will be included with every event
      const appName = `ws-app-${process.env.PROJECT_ID}`;
      
      posthog.register({
        app_name: appName,
        app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        environment: "user-production"
      });
      
      // Manually capture pageview after PostHog loads
      if (typeof window !== 'undefined') {
        posthog.capture('$pageview');
      }
    }
  });
}