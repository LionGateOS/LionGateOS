/**
 * MODULE CONTRACT — LIONGATEOS TRAVELS
 * 
 * This contract declares LionGateOS Travels as a first-class workspace module
 * compatible with the LionGateOS "Fridge / Magnet / Blackboard OS" paradigm.
 * 
 * Status: CANONICAL
 * Authority: LionGateOS Core
 * Governance: PROJECT_LIFESAVER
 */

export interface ModuleContract {
  // Module Identity
  id: string;
  name: string;
  version: string;
  type: 'workspace-module' | 'utility-module' | 'system-module';
  
  // Module Capabilities
  capabilities: ModuleCapabilities;
  
  // Required APIs from Core
  requiredApis: string[];
  
  // AI Features
  aiFeatures: AIFeatureDeclaration[];
  
  // Views
  views: ModuleView[];
  
  // Subscription Requirements
  subscriptionTiers: SubscriptionRequirement[];
}

export interface ModuleCapabilities {
  draggable: boolean;
  resizable: boolean;
  minimizable: boolean;
  maximizable: boolean;
  multiInstance: boolean;
  persistState: boolean;
  theming: 'core-controlled' | 'self-controlled';
}

export interface AIFeatureDeclaration {
  featureId: string;
  name: string;
  purpose: string;
  triggerType: 'user-initiated' | 'event-triggered' | 'background';
  costTier: 'free' | 'basic' | 'premium';
}

export interface ModuleView {
  id: string;
  name: string;
  icon?: string;
  defaultActive?: boolean;
  requiresSubscription?: string;
}

export interface SubscriptionRequirement {
  featureId: string;
  minimumTier: 'free' | 'basic' | 'premium' | 'enterprise';
  fallbackBehavior: 'disable' | 'prompt' | 'limit';
}

/**
 * LIONGATEOS TRAVELS MODULE CONTRACT
 * 
 * Compliance Notes:
 * - NO payment logic inside module
 * - AI requests routed through LionGateOS Core only
 * - Theming controlled by Core CSS variables
 * - API providers swappable by Core
 */
export const TravelsModuleContract: ModuleContract = {
  // Module Identity
  id: 'liongateos.travels',
  name: 'LionGateOS Travels',
  version: '2.0.0-workspace-refactor',
  type: 'workspace-module',
  
  // Module Capabilities
  capabilities: {
    draggable: true,
    resizable: true,
    minimizable: true,
    maximizable: true,
    multiInstance: false, // Single instance per workspace
    persistState: true,
    theming: 'core-controlled', // CRITICAL: No self-theming
  },
  
  // Required APIs from LionGateOS Core
  requiredApis: [
    'liongateos.ai.gateway',        // AI request routing
    'liongateos.subscription.check', // Feature availability
    'liongateos.theme.variables',    // Theme system
    'liongateos.layout.registry',    // Blackboard integration
    'liongateos.storage.user',       // User data persistence
  ],
  
  // AI Features Declaration
  aiFeatures: [
    {
      featureId: 'travels.ai.trip-planning',
      name: 'Trip Planning Assistant',
      purpose: 'Help users organize trip components and scenarios',
      triggerType: 'user-initiated',
      costTier: 'basic',
    },
    {
      featureId: 'travels.ai.itinerary-refine',
      name: 'Itinerary Refinement',
      purpose: 'Suggest neutral scenario adjustments based on constraints',
      triggerType: 'user-initiated',
      costTier: 'basic',
    },
    {
      featureId: 'travels.ai.destination-intelligence',
      name: 'Destination Intelligence',
      purpose: 'Provide factual info on climate, culture, health, logistics',
      triggerType: 'user-initiated',
      costTier: 'free',
    },
    {
      featureId: 'travels.ai.constraint-analysis',
      name: 'Constraint Analysis',
      purpose: 'Surface time, cost, distance constraints',
      triggerType: 'user-initiated',
      costTier: 'free',
    },
    {
      featureId: 'travels.ai.voice-output',
      name: 'Voice Output',
      purpose: 'Gemini-powered voice responses',
      triggerType: 'user-initiated',
      costTier: 'premium',
    },
  ],
  
  // Module Views
  views: [
    {
      id: 'search',
      name: 'Search',
      icon: 'search',
      defaultActive: true,
    },
    {
      id: 'planner',
      name: 'Planner',
      icon: 'calendar',
    },
    {
      id: 'trips',
      name: 'My Trips',
      icon: 'briefcase',
    },
    {
      id: 'saved',
      name: 'Saved',
      icon: 'bookmark',
    },
    {
      id: 'ai-assist',
      name: 'AI Assist',
      icon: 'sparkles',
      requiresSubscription: 'basic',
    },
  ],
  
  // Subscription Requirements
  subscriptionTiers: [
    {
      featureId: 'unlimited-trips',
      minimumTier: 'basic',
      fallbackBehavior: 'limit',
    },
    {
      featureId: 'ai-assist',
      minimumTier: 'basic',
      fallbackBehavior: 'prompt',
    },
    {
      featureId: 'voice-output',
      minimumTier: 'premium',
      fallbackBehavior: 'disable',
    },
    {
      featureId: 'advanced-scenarios',
      minimumTier: 'premium',
      fallbackBehavior: 'limit',
    },
    {
      featureId: 'api-integrations',
      minimumTier: 'premium',
      fallbackBehavior: 'disable',
    },
  ],
};

/**
 * GOVERNANCE COMPLIANCE NOTES
 * 
 * From: LIONGATEOS_TRAVELS_PLANNER_BOUNDARIES_AND_PHASE2.md
 * 
 * Travels MUST NOT:
 * - Recommend destinations, vendors, airlines, hotels, or services
 * - Perform bookings or transactions  
 * - Rank or label "best" choices
 * - Sell outcomes or pressure decisions
 * - Compete with travel agents or consultants
 * 
 * Travels MAY:
 * - Organize itineraries, dates, and trip components
 * - Display cost breakdowns and comparisons
 * - Reflect pricing data from external sources
 * - Show multiple trip scenarios side-by-side
 * - Surface constraints (time, cost, location) as neutral facts
 * 
 * From: LionGateOS_Minimal_Theming_Contract.md
 * 
 * Runtime pages MUST NOT define:
 * - Colors, gradients, shadows, backgrounds
 * - Typography, font sizes, weights
 * - Brand marks, logos, visual identity elements
 * - Motion, transitions, animation behavior
 * 
 * From: LIONGATEOS_API_BOUNDARY_DEFINITIONS_FINAL.md
 * 
 * Forbidden Paths:
 * - App → AI model
 * - App → payment provider
 * - App → database write
 * - App → app direct integration
 */
