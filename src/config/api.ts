/**
 * API Configuration
 * Centralized API configuration to avoid re-evaluation on every render
 */

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",

    ENDPOINTS: {
        SLACK: {
            CONNECTIONS: "/integrations/slack/connections",
            WEBHOOKS: "/integrations/slack/webhooks",
            TEST: "/integrations/slack/test",
            SEND: "/integrations/slack/send",
            OAUTH_AUTHORIZE: "/integrations/slack/oauth/authorize",
        },
        EMAIL: {
            TEST: "/integrations/email/test",
            SEND: "/integrations/email/send",
        },
    },

    // OAuth polling configuration
    OAUTH: {
        POLL_INTERVAL_MS: 1000,
        MAX_POLL_DURATION_MS: 300000, // 5 minutes
        POPUP_WIDTH: 600,
        POPUP_HEIGHT: 700,
    },

    // Notification auto-dismiss durations
    NOTIFICATION: {
        SUCCESS_DURATION_MS: 3000,
        ERROR_DURATION_MS: 5000,
        INFO_DURATION_MS: 4000,
    },
} as const;

/**
 * Helper to build full API URL
 */
export function buildApiUrl(endpoint: string): string {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
