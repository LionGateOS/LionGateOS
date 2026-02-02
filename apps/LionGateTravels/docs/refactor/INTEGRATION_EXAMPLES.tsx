/**
 * LIONGATEOS TRAVELS — INTEGRATION EXAMPLE
 * 
 * This file shows how LionGateOS Core would integrate the Travels module.
 * This is an EXAMPLE ONLY - not production code.
 * 
 * For LionGateOS Core developers.
 */

import React from 'react';
import { TravelsModule } from './components/TravelsModule';
import { LionGateOS_Core_API } from './core/liongateos.api';

/**
 * EXAMPLE 1: Basic Integration (Legacy Mode)
 * 
 * Renders Travels as a full-page module using mock Core API.
 * This is the current behavior.
 */
export const Example_BasicIntegration: React.FC = () => {
  return (
    <TravelsModule
      // No coreAPI provided - uses mock
      initialView="search"
    />
  );
};

/**
 * EXAMPLE 2: Core API Integration
 * 
 * Renders Travels with real Core API.
 * This is how production would work.
 */
export const Example_WithCoreAPI: React.FC = () => {
  // Core would provide its real API implementation
  const coreAPI: LionGateOS_Core_API = {
    ai: {
      async *requestAI(request) {
        // Route to Claude/Gemini via Core's AI gateway
        const response = await fetch('/api/liongateos/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              yield data;
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      },
      
      async requestVoiceOutput(text, options) {
        const response = await fetch('/api/liongateos/ai/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, options }),
        });
        
        return response.json();
      },
    },
    
    subscription: {
      async isFeatureAvailable(featureId) {
        const response = await fetch(`/api/liongateos/subscription/check?feature=${featureId}`);
        return response.json();
      },
      
      async getSubscriptionTier() {
        const response = await fetch('/api/liongateos/subscription/tier');
        return response.json();
      },
      
      async getUpgradePrompt(featureId) {
        const response = await fetch(`/api/liongateos/subscription/upgrade-prompt?feature=${featureId}`);
        return response.json();
      },
    },
    
    theme: {
      getCurrentTheme() {
        // Return Core's current theme
        return {
          '--lg-bg': getComputedStyle(document.documentElement).getPropertyValue('--lg-bg'),
          '--lg-bg-secondary': getComputedStyle(document.documentElement).getPropertyValue('--lg-bg-secondary'),
          // ... all other theme variables
        } as any;
      },
      
      onThemeChange(callback) {
        // Subscribe to Core's theme changes
        const observer = new MutationObserver(() => {
          callback(this.getCurrentTheme());
        });
        
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        });
        
        return () => observer.disconnect();
      },
    },
    
    layout: {
      registerModule(config) {
        // Register with Core's layout manager
        console.log('Module registered:', config);
      },
      
      isBlackboardMode() {
        // Check Core's layout mode
        return document.body.dataset.layoutMode === 'blackboard';
      },
      
      getPanelState() {
        // Get panel state from Core's layout manager
        const state = localStorage.getItem('lg-travels-panel-state');
        return state ? JSON.parse(state) : null;
      },
      
      updatePanelState(state) {
        // Update panel state in Core's layout manager
        const currentState = this.getPanelState() || {};
        const newState = { ...currentState, ...state };
        localStorage.setItem('lg-travels-panel-state', JSON.stringify(newState));
      },
    },
    
    storage: {
      async save(key, data) {
        await fetch('/api/liongateos/storage/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'liongateos.travels', key, data }),
        });
      },
      
      async load(key) {
        const response = await fetch(`/api/liongateos/storage/load?module=liongateos.travels&key=${key}`);
        if (!response.ok) return null;
        return response.json();
      },
      
      async delete(key) {
        await fetch('/api/liongateos/storage/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'liongateos.travels', key }),
        });
      },
      
      async listKeys(prefix) {
        const response = await fetch(`/api/liongateos/storage/list?module=liongateos.travels&prefix=${prefix}`);
        return response.json();
      },
    },
  };
  
  return (
    <TravelsModule
      coreAPI={coreAPI}
      initialView="search"
    />
  );
};

/**
 * EXAMPLE 3: Blackboard Mode Integration
 * 
 * Renders Travels as a draggable panel in Blackboard mode.
 */
export const Example_BlackboardMode: React.FC = () => {
  const [panels, setPanels] = React.useState([
    { id: 'travels', x: 100, y: 100, width: 800, height: 600 },
  ]);
  
  const coreAPI: LionGateOS_Core_API = {
    // ... same as Example 2 but with:
    
    layout: {
      registerModule(config) {
        console.log('Module registered for Blackboard:', config);
      },
      
      isBlackboardMode() {
        return true; // BLACKBOARD MODE ENABLED
      },
      
      getPanelState() {
        return panels.find(p => p.id === 'travels') || null;
      },
      
      updatePanelState(state) {
        setPanels(prev => prev.map(p => 
          p.id === 'travels' ? { ...p, ...state } : p
        ));
      },
    },
  } as any;
  
  return (
    <div className="blackboard-workspace" style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: 'var(--lg-bg)',
    }}>
      <TravelsModule
        coreAPI={coreAPI}
        initialView="search"
      />
    </div>
  );
};

/**
 * EXAMPLE 4: Multiple Instances
 * 
 * Shows how multiple modules can coexist in Blackboard mode.
 */
export const Example_MultipleModules: React.FC = () => {
  // Core would manage multiple module instances
  return (
    <div className="blackboard-workspace">
      {/* Budget Module */}
      <div style={{ position: 'absolute', left: 50, top: 50 }}>
        {/* <BudgetModule coreAPI={...} /> */}
      </div>
      
      {/* Travels Module */}
      <div style={{ position: 'absolute', left: 400, top: 50 }}>
        <TravelsModule />
      </div>
      
      {/* SmartQuoteAI Module */}
      <div style={{ position: 'absolute', left: 50, top: 400 }}>
        {/* <SmartQuoteAIModule coreAPI={...} /> */}
      </div>
    </div>
  );
};

/**
 * EXAMPLE 5: Theme Switching
 * 
 * Shows how Core can switch themes dynamically.
 */
export const Example_ThemeSwitching: React.FC = () => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  
  const switchTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Core would update CSS variables
    if (newTheme === 'light') {
      document.documentElement.style.setProperty('--lg-bg', '#ffffff');
      document.documentElement.style.setProperty('--lg-text', '#000000');
      document.documentElement.style.setProperty('--lg-panel', 'rgba(255,255,255,0.7)');
      // ... etc
    } else {
      document.documentElement.style.setProperty('--lg-bg', '#020617');
      document.documentElement.style.setProperty('--lg-text', '#e5e7eb');
      document.documentElement.style.setProperty('--lg-panel', 'rgba(15,23,42,0.7)');
      // ... etc
    }
  };
  
  return (
    <div>
      <button onClick={switchTheme}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
      
      <TravelsModule />
    </div>
  );
};

/**
 * EXAMPLE 6: Subscription Gating
 * 
 * Shows how Core controls feature availability.
 */
export const Example_SubscriptionGating: React.FC = () => {
  const [userTier, setUserTier] = React.useState<'free' | 'basic' | 'premium'>('free');
  
  const coreAPI: LionGateOS_Core_API = {
    // ... other APIs
    
    subscription: {
      async isFeatureAvailable(featureId) {
        // Define feature requirements
        const features = {
          'unlimited-trips': 'basic',
          'ai-assist': 'basic',
          'voice-output': 'premium',
          'advanced-scenarios': 'premium',
          'api-integrations': 'premium',
        } as any;
        
        const required = features[featureId] || 'free';
        
        const tierLevels = { free: 0, basic: 1, premium: 2 };
        const available = tierLevels[userTier] >= tierLevels[required];
        
        return {
          available,
          reason: available ? undefined : 'subscription',
          upgradeRequired: available ? undefined : required,
        };
      },
      
      async getSubscriptionTier() {
        return {
          tier: userTier,
          features: [],
          limits: {},
        };
      },
      
      async getUpgradePrompt(featureId) {
        return {
          title: 'Upgrade Required',
          message: `This feature requires a ${featureId} subscription.`,
          actionText: 'Upgrade Now',
        };
      },
    },
  } as any;
  
  return (
    <div>
      <select value={userTier} onChange={e => setUserTier(e.target.value as any)}>
        <option value="free">Free Tier</option>
        <option value="basic">Basic Tier</option>
        <option value="premium">Premium Tier</option>
      </select>
      
      <TravelsModule coreAPI={coreAPI} />
    </div>
  );
};

/**
 * CRITICAL NOTES FOR CORE DEVELOPERS
 * 
 * 1. AI Gateway
 *    - Travels NEVER calls AI providers directly
 *    - All requests go through Core's AI gateway
 *    - Core handles rate limiting, cost tracking, model selection
 * 
 * 2. Subscription System
 *    - Travels NEVER processes payments
 *    - Core provides feature availability checks
 *    - Core provides upgrade prompts
 *    - Travels only displays what Core tells it
 * 
 * 3. Theme System
 *    - Travels NEVER defines colors
 *    - Core controls all theme variables
 *    - Travels reacts to theme changes automatically
 *    - CSS variables propagate to all components
 * 
 * 4. Layout System
 *    - Core controls Blackboard vs Legacy mode
 *    - Core manages panel positions and z-index
 *    - Travels adapts to mode automatically
 *    - Drag/resize handled by Core or Travels (configurable)
 * 
 * 5. Storage System
 *    - Travels uses Core's storage API
 *    - Core handles encryption, sync, backup
 *    - Data scoped to module automatically
 *    - No direct localStorage access (except in mock)
 * 
 * 6. API Providers
 *    - Travels uses provider abstractions
 *    - Core can swap providers without code changes
 *    - Affiliate links generated by Core
 *    - Rate limiting handled by Core
 */
