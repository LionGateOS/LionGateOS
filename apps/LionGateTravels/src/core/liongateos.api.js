/**
 * LIONGATEOS CORE API INTERFACES
 *
 * These interfaces define how LionGateOS Travels interacts with LionGateOS Core.
 * All requests are routed through Core - never directly to providers.
 *
 * Governance: LIONGATEOS_API_BOUNDARY_DEFINITIONS_FINAL.md
 */
// ============================================================================
// MOCK IMPLEMENTATION (for development)
// ============================================================================
/**
 * Mock Core API for development
 * Replace with real Core API in production
 */
export const createMockCoreAPI = () => {
    return {
        ai: {
            async *requestAI(request) {
                // Mock streaming response
                yield { type: 'thinking' };
                await new Promise(resolve => setTimeout(resolve, 500));
                yield {
                    type: 'content',
                    content: 'This is a mock AI response. Real AI will be routed through LionGateOS Core.',
                };
                yield { type: 'done' };
            },
            async requestVoiceOutput(text) {
                return {
                    audioUrl: '',
                    duration: 0,
                    transcript: text,
                };
            },
        },
        subscription: {
            async isFeatureAvailable(featureId) {
                // Mock: all features available in dev
                return {
                    available: true,
                };
            },
            async getSubscriptionTier() {
                return {
                    tier: 'premium',
                    features: ['all'],
                    limits: {},
                };
            },
            async getUpgradePrompt() {
                return {
                    title: 'Upgrade Required',
                    message: 'This feature requires a premium subscription.',
                    actionText: 'Upgrade Now',
                };
            },
        },
        theme: {
            getCurrentTheme() {
                // Return default theme
                return {
                    '--lg-bg': '#020617',
                    '--lg-bg-secondary': '#0f172a',
                    '--lg-panel': 'rgba(15,23,42,.7)',
                    '--lg-panel-secondary': 'rgba(15,23,42,.55)',
                    '--lg-panel-hover': 'rgba(15,23,42,.85)',
                    '--lg-border': 'rgba(148,163,184,.28)',
                    '--lg-border-focus': 'rgba(56,189,248,.45)',
                    '--lg-text': '#e5e7eb',
                    '--lg-text-muted': '#94a3b8',
                    '--lg-text-secondary': '#cbd5e1',
                    '--lg-accent': '#38bdf8',
                    '--lg-accent-hover': '#0ea5e9',
                    '--lg-accent-rgb': '56,189,248',
                    '--lg-glow': '0 0 20px rgba(56,189,248,.3)',
                    '--lg-shadow': '0 4px 16px rgba(0,0,0,.2)',
                    '--lg-blur': 'blur(10px)',
                    '--lg-radius-sm': '8px',
                    '--lg-radius-md': '12px',
                    '--lg-radius-lg': '16px',
                    '--lg-transition-fast': '150ms ease',
                    '--lg-transition-normal': '250ms ease',
                    '--lg-transition-slow': '400ms ease',
                };
            },
            onThemeChange(callback) {
                // Mock: no-op unsubscribe
                return () => { };
            },
        },
        layout: {
            registerModule() {
                // Mock: no-op
            },
            isBlackboardMode() {
                return false; // Default to legacy mode
            },
            getPanelState() {
                return null;
            },
            updatePanelState() {
                // Mock: no-op
            },
        },
        storage: {
            async save(key, data) {
                localStorage.setItem(`liongateos.travels.${key}`, JSON.stringify(data));
            },
            async load(key) {
                const data = localStorage.getItem(`liongateos.travels.${key}`);
                return data ? JSON.parse(data) : null;
            },
            async delete(key) {
                localStorage.removeItem(`liongateos.travels.${key}`);
            },
            async listKeys(prefix) {
                const keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key?.startsWith(`liongateos.travels.${prefix}`)) {
                        keys.push(key.replace('liongateos.travels.', ''));
                    }
                }
                return keys;
            },
        },
    };
};
