/**
 * LIONGATEOS CORE API INTERFACES
 * 
 * These interfaces define how LionGateOS Travels interacts with LionGateOS Core.
 * All requests are routed through Core - never directly to providers.
 * 
 * Governance: LIONGATEOS_API_BOUNDARY_DEFINITIONS_FINAL.md
 */

// ============================================================================
// AI GATEWAY API
// ============================================================================

export interface LionGateOS_AI_Gateway {
  /**
   * Request AI assistance from LionGateOS Core
   * Core will route to appropriate provider (Claude, Gemini, etc.)
   * 
   * @param request AI request parameters
   * @returns Stream of AI response chunks
   */
  requestAI(request: AI_Request): AsyncIterableIterator<AI_ResponseChunk>;
  
  /**
   * Request voice output from AI
   * Only available for premium tier
   */
  requestVoiceOutput(text: string, voice: VoiceOptions): Promise<AI_VoiceResponse>;
}

export interface AI_Request {
  featureId: string; // Must match aiFeatures in module contract
  context: AI_Context;
  messages: AI_Message[];
  streamResponse?: boolean;
}

export interface AI_Context {
  tripData?: unknown; // Current trip being worked on
  userPreferences?: unknown;
  conversationHistory?: AI_Message[];
}

export interface AI_Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AI_ResponseChunk {
  type: 'thinking' | 'content' | 'done' | 'error';
  content?: string;
  metadata?: {
    tokensUsed?: number;
    model?: string;
  };
}

export interface AI_VoiceResponse {
  audioUrl: string;
  duration: number;
  transcript: string;
}

export interface VoiceOptions {
  language?: string;
  speed?: number;
  pitch?: number;
}

// ============================================================================
// SUBSCRIPTION API
// ============================================================================

export interface LionGateOS_Subscription_Check {
  /**
   * Check if a feature is available for current user
   * Core handles all subscription logic
   * 
   * @param featureId Feature identifier from module contract
   * @returns Feature availability status
   */
  isFeatureAvailable(featureId: string): Promise<FeatureAvailability>;
  
  /**
   * Get current subscription tier
   */
  getSubscriptionTier(): Promise<SubscriptionTier>;
  
  /**
   * Get upgrade prompt for locked feature
   * Module never handles payment - just displays Core's prompt
   */
  getUpgradePrompt(featureId: string): Promise<UpgradePrompt>;
}

export interface FeatureAvailability {
  available: boolean;
  reason?: 'subscription' | 'quota' | 'disabled';
  currentUsage?: number;
  limit?: number;
  upgradeRequired?: string; // Tier needed
}

export interface SubscriptionTier {
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  features: string[];
  limits: Record<string, number>;
}

export interface UpgradePrompt {
  title: string;
  message: string;
  actionText: string;
  actionUrl?: string; // Handled by Core, never by module
}

// ============================================================================
// THEME API
// ============================================================================

export interface LionGateOS_Theme_Variables {
  /**
   * Get current theme variables
   * Module applies these but never defines them
   */
  getCurrentTheme(): ThemeVariables;
  
  /**
   * Subscribe to theme changes
   */
  onThemeChange(callback: (theme: ThemeVariables) => void): () => void;
}

export interface ThemeVariables {
  // Background
  '--lg-bg': string;
  '--lg-bg-secondary': string;
  
  // Panels
  '--lg-panel': string;
  '--lg-panel-secondary': string;
  '--lg-panel-hover': string;
  
  // Borders
  '--lg-border': string;
  '--lg-border-focus': string;
  
  // Text
  '--lg-text': string;
  '--lg-text-muted': string;
  '--lg-text-secondary': string;
  
  // Accent
  '--lg-accent': string;
  '--lg-accent-hover': string;
  '--lg-accent-rgb': string; // For rgba usage
  
  // Effects
  '--lg-glow': string;
  '--lg-shadow': string;
  '--lg-blur': string;
  
  // Radius
  '--lg-radius-sm': string;
  '--lg-radius-md': string;
  '--lg-radius-lg': string;
  
  // Animation
  '--lg-transition-fast': string;
  '--lg-transition-normal': string;
  '--lg-transition-slow': string;
}

// ============================================================================
// LAYOUT REGISTRY API
// ============================================================================

export interface LionGateOS_Layout_Registry {
  /**
   * Register module with layout system
   * Enables Blackboard/draggable functionality
   */
  registerModule(config: ModuleLayoutConfig): void;
  
  /**
   * Check if Blackboard mode is active
   */
  isBlackboardMode(): boolean;
  
  /**
   * Get current panel position/size
   */
  getPanelState(): PanelState | null;
  
  /**
   * Update panel state
   */
  updatePanelState(state: Partial<PanelState>): void;
}

export interface ModuleLayoutConfig {
  moduleId: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable: boolean;
  draggable: boolean;
}

export interface PanelState {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

// ============================================================================
// STORAGE API
// ============================================================================

export interface LionGateOS_Storage_User {
  /**
   * Save user data through Core
   * Core handles encryption, sync, backup
   */
  save<T>(key: string, data: T): Promise<void>;
  
  /**
   * Load user data
   */
  load<T>(key: string): Promise<T | null>;
  
  /**
   * Delete user data
   */
  delete(key: string): Promise<void>;
  
  /**
   * List all keys for this module
   */
  listKeys(prefix: string): Promise<string[]>;
}

// ============================================================================
// CORE API AGGREGATOR
// ============================================================================

/**
 * Main interface to LionGateOS Core
 * Provided to module at initialization
 */
export interface LionGateOS_Core_API {
  ai: LionGateOS_AI_Gateway;
  subscription: LionGateOS_Subscription_Check;
  theme: LionGateOS_Theme_Variables;
  layout: LionGateOS_Layout_Registry;
  storage: LionGateOS_Storage_User;
}

// ============================================================================
// MOCK IMPLEMENTATION (for development)
// ============================================================================

/**
 * Mock Core API for development
 * Replace with real Core API in production
 */
export const createMockCoreAPI = (): LionGateOS_Core_API => {
  return {
    ai: {
      async *requestAI(request: AI_Request) {
        // Mock streaming response
        yield { type: 'thinking' } as AI_ResponseChunk;
        await new Promise(resolve => setTimeout(resolve, 500));
        yield {
          type: 'content',
          content: 'This is a mock AI response. Real AI will be routed through LionGateOS Core.',
        } as AI_ResponseChunk;
        yield { type: 'done' } as AI_ResponseChunk;
      },
      async requestVoiceOutput(text: string) {
        return {
          audioUrl: '',
          duration: 0,
          transcript: text,
        };
      },
    },
    
    subscription: {
      async isFeatureAvailable(featureId: string) {
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
        return () => {};
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
      async save(key: string, data: unknown) {
        localStorage.setItem(`liongateos.travels.${key}`, JSON.stringify(data));
      },
      async load(key: string) {
        const data = localStorage.getItem(`liongateos.travels.${key}`);
        return data ? JSON.parse(data) : null;
      },
      async delete(key: string) {
        localStorage.removeItem(`liongateos.travels.${key}`);
      },
      async listKeys(prefix: string) {
        const keys: string[] = [];
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
