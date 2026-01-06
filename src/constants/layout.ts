/**
 * Layout Constants
 * Centralized layout dimensions and breakpoints for the application
 */

export const LAYOUT_CONSTANTS = {
    NAVBAR_HEIGHT: 64,

    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1280,
    },

    SIDEBAR_WIDTHS: {
        CATEGORY: {
            MOBILE: 48,
            TABLET: 48,
            DESKTOP: 56,
        },
        BLOCKS: {
            MOBILE: 140,
            TABLET: 140,
            LAPTOP: 160,
            DESKTOP: 170,
        },
        CONFIG: {
            MOBILE: 280,
            TABLET: 280,
            LAPTOP: 300,
            DESKTOP: 320,
        },
    },

    TOOLBAR: {
        PADDING: {
            MOBILE: 8,
            DESKTOP: 12,
        },
        HEIGHT: {
            MOBILE: 28,
            DESKTOP: 36,
        },
    },

    Z_INDEX: {
        BACKDROP: 40,
        DRAWER: 50,
        TOOLBAR: 10,
    },
} as const;

export const UI_CONSTANTS = {
    TOOLTIP_DELAY: 300,
    ANIMATION_DURATION: 200,
    DEBOUNCE_DELAY: 150,
} as const;
