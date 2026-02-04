import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { createMockCoreAPI } from '../core/liongateos.api';
import { TravelsModuleContract } from '../module.contract';
import './TravelsModule.css';
// Import existing pages (we'll adapt them gradually)
import Overview from '../pages/Overview';
import Trips from '../pages/Trips';
export const TravelsModule = ({ coreAPI = createMockCoreAPI(), // Mock for development
initialView = 'search', }) => {
    const [currentView, setCurrentView] = React.useState(initialView);
    const [state, setState] = React.useState({
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
    const [viewsAvailable, setViewsAvailable] = React.useState({});
    React.useEffect(() => {
        const checkViews = async () => {
            const available = {};
            for (const view of TravelsModuleContract.views) {
                if (view.requiresSubscription) {
                    const result = await coreAPI.subscription.isFeatureAvailable(view.id);
                    available[view.id] = result.available;
                }
                else {
                    available[view.id] = true;
                }
            }
            setViewsAvailable(available);
        };
        checkViews();
    }, [coreAPI]);
    const handleViewChange = async (viewId) => {
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
                return _jsx(Overview, { state: state, setState: setState });
            case 'planner':
                return (_jsxs("div", { className: "travels-view travels-view--planner", children: [_jsxs("div", { className: "travels-view-header", children: [_jsx("h2", { children: "Trip Planner" }), _jsx("p", { className: "travels-view-description", children: "Organize trip components and compare scenarios" })] }), _jsx("div", { className: "travels-view-content", children: _jsxs("div", { className: "travels-placeholder", children: [_jsx("div", { className: "travels-placeholder-icon", children: "\uD83D\uDCC5" }), _jsx("h3", { children: "Planning Interface" }), _jsx("p", { children: "Multi-scenario trip planning UI will be implemented here" })] }) })] }));
            case 'trips':
                return _jsx(Trips, { state: state, setState: setState });
            case 'saved':
                return (_jsxs("div", { className: "travels-view travels-view--saved", children: [_jsxs("div", { className: "travels-view-header", children: [_jsx("h2", { children: "Saved Destinations" }), _jsx("p", { className: "travels-view-description", children: "Your bookmarked places and trip ideas" })] }), _jsx("div", { className: "travels-view-content", children: _jsxs("div", { className: "travels-placeholder", children: [_jsx("div", { className: "travels-placeholder-icon", children: "\uD83D\uDD16" }), _jsx("h3", { children: "Saved Items" }), _jsx("p", { children: "Saved destinations and trip ideas will appear here" })] }) })] }));
            case 'ai-assist':
                return _jsx(AIAssistant, { coreAPI: coreAPI, tripContext: state });
            default:
                return _jsx(Overview, { state: state, setState: setState });
        }
    };
    return (_jsx(PanelFrame, { moduleId: TravelsModuleContract.id, title: TravelsModuleContract.name, coreAPI: coreAPI, className: "travels-module", headerActions: _jsx("div", { className: "travels-status", children: _jsx("span", { className: "travels-status-dot", title: "Connected to LionGateOS Core" }) }), children: _jsxs("div", { className: "travels-module-inner", children: [_jsx("nav", { className: "travels-nav", children: TravelsModuleContract.views.map(view => {
                        const isAvailable = viewsAvailable[view.id] !== false;
                        const isActive = currentView === view.id;
                        return (_jsxs("button", { className: `travels-nav-item ${isActive ? 'travels-nav-item--active' : ''} ${!isAvailable ? 'travels-nav-item--locked' : ''}`, onClick: () => handleViewChange(view.id), disabled: !isAvailable, children: [_jsx("span", { className: "travels-nav-icon", children: getViewIcon(view.icon) }), _jsx("span", { className: "travels-nav-label", children: view.name }), !isAvailable && _jsx("span", { className: "travels-nav-lock", children: "\uD83D\uDD12" })] }, view.id));
                    }) }), _jsx("div", { className: "travels-content", children: renderView() })] }) }));
};
/**
 * Get icon for view
 */
const getViewIcon = (icon) => {
    const icons = {
        search: '🔍',
        calendar: '📅',
        briefcase: '💼',
        bookmark: '🔖',
        sparkles: '✨',
    };
    return icons[icon || 'search'] || '•';
};
