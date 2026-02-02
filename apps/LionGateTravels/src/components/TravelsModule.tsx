/**
 * LIONGATEOS TRAVELS MODULE
 * 
 * Main workspace module component implementing the Fridge/Magnet/Blackboard paradigm.
 * 
 * Architecture:
 * - Multiple internal views (Search, Planner, Trips, Saved, AI Assist)
 * - Theme-controlled by LionGateOS Core
 * - AI requests routed through Core
 * - Subscription-aware feature gating
 * - API provider abstraction
 * 
 * Governance: Multiple contracts (see module.contract.ts)
 */

import React from 'react';
import { PanelFrame } from './PanelFrame';
import { AIAssistant } from './AIAssistant';
import { LionGateOS_Core_API, createMockCoreAPI } from '../core/liongateos.api';
import { TravelsModuleContract } from '../module.contract';
import './TravelsModule.css';

// Import existing pages (we'll adapt them gradually)
import Overview from '../pages/Overview';
import Trips from '../pages/Trips';

export interface TravelsModuleProps {
  // Core API injected by LionGateOS
  coreAPI?: LionGateOS_Core_API;
  
  // Initial view
  initialView?: string;
}

export const TravelsModule: React.FC<TravelsModuleProps> = ({
  coreAPI = createMockCoreAPI(), // Mock for development
  initialView = 'search',
}) => {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [state, setState] = React.useState<any>({
    trips: [],
    quotes: [],
    clients: [],
    tasks: [],
  });
  
  // Apply theme on mount
  React.useEffect(() => {
    const theme = coreAPI.theme.getCurrentTheme();
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [coreAPI]);
  
  // Check feature availability for views
  const [viewsAvailable, setViewsAvailable] = React.useState<Record<string, boolean>>({});
  
  React.useEffect(() => {
    const checkViews = async () => {
      const available: Record<string, boolean> = {};
      
      for (const view of TravelsModuleContract.views) {
        if (view.requiresSubscription) {
          const result = await coreAPI.subscription.isFeatureAvailable(view.id);
          available[view.id] = result.available;
        } else {
          available[view.id] = true;
        }
      }
      
      setViewsAvailable(available);
    };
    
    checkViews();
  }, [coreAPI]);
  
  const handleViewChange = async (viewId: string) => {
    // Check if view is available
    if (!viewsAvailable[viewId]) {
      const prompt = await coreAPI.subscription.getUpgradePrompt(viewId);
      // Show upgrade prompt (Core handles this, we just display)
      alert(`${prompt.title}\n\n${prompt.message}`);
      return;
    }
    
    setCurrentView(viewId);
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'search':
        return <Overview state={state} setState={setState} />;
        
      case 'planner':
        return (
          <div className="travels-view travels-view--planner">
            <div className="travels-view-header">
              <h2>Trip Planner</h2>
              <p className="travels-view-description">
                Organize trip components and compare scenarios
              </p>
            </div>
            <div className="travels-view-content">
              <div className="travels-placeholder">
                <div className="travels-placeholder-icon">📅</div>
                <h3>Planning Interface</h3>
                <p>Multi-scenario trip planning UI will be implemented here</p>
              </div>
            </div>
          </div>
        );
        
      case 'trips':
        return <Trips state={state} setState={setState} />;
        
      case 'saved':
        return (
          <div className="travels-view travels-view--saved">
            <div className="travels-view-header">
              <h2>Saved Destinations</h2>
              <p className="travels-view-description">
                Your bookmarked places and trip ideas
              </p>
            </div>
            <div className="travels-view-content">
              <div className="travels-placeholder">
                <div className="travels-placeholder-icon">🔖</div>
                <h3>Saved Items</h3>
                <p>Saved destinations and trip ideas will appear here</p>
              </div>
            </div>
          </div>
        );
        
      case 'ai-assist':
        return <AIAssistant coreAPI={coreAPI} tripContext={state} />;
        
      default:
        return <Overview state={state} setState={setState} />;
    }
  };
  
  return (
    <PanelFrame
      moduleId={TravelsModuleContract.id}
      title={TravelsModuleContract.name}
      coreAPI={coreAPI}
      className="travels-module"
      headerActions={
        <div className="travels-status">
          <span className="travels-status-dot" title="Connected to LionGateOS Core" />
        </div>
      }
    >
      <div className="travels-module-inner">
        {/* View Navigation */}
        <nav className="travels-nav">
          {TravelsModuleContract.views.map(view => {
            const isAvailable = viewsAvailable[view.id] !== false;
            const isActive = currentView === view.id;
            
            return (
              <button
                key={view.id}
                className={`travels-nav-item ${isActive ? 'travels-nav-item--active' : ''} ${!isAvailable ? 'travels-nav-item--locked' : ''}`}
                onClick={() => handleViewChange(view.id)}
                disabled={!isAvailable}
              >
                <span className="travels-nav-icon">{getViewIcon(view.icon)}</span>
                <span className="travels-nav-label">{view.name}</span>
                {!isAvailable && <span className="travels-nav-lock">🔒</span>}
              </button>
            );
          })}
        </nav>
        
        {/* View Content */}
        <div className="travels-content">
          {renderView()}
        </div>
      </div>
    </PanelFrame>
  );
};

/**
 * Get icon for view
 */
const getViewIcon = (icon?: string): string => {
  const icons: Record<string, string> = {
    search: '🔍',
    calendar: '📅',
    briefcase: '💼',
    bookmark: '🔖',
    sparkles: '✨',
  };
  
  return icons[icon || 'search'] || '•';
};

/**
 * INTEGRATION NOTES
 * 
 * This component serves as the integration point between:
 * 1. LionGateOS Core (via coreAPI)
 * 2. Existing Travels pages (gradual migration)
 * 3. New workspace features (AI, multi-view, etc.)
 * 
 * Migration Strategy:
 * - Existing pages (Overview, Trips, etc.) work as-is
 * - Gradually refactor them to be theme-aware
 * - Add new views (Planner, Saved, AI) incrementally
 * - All changes are additive and reversible
 * 
 * Theme Integration:
 * - PanelFrame applies Core theme variables
 * - Child components use CSS variables
 * - No hardcoded colors anywhere
 * 
 * API Integration:
 * - All AI requests via coreAPI.ai
 * - All subscription checks via coreAPI.subscription
 * - All provider calls abstracted (see api.providers.ts)
 */
