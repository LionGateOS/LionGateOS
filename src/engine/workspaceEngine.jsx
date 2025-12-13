import React from 'react';
import HomeView from '../views/HomeView.jsx';
import TravelOrchestratorView from '../views/TravelOrchestratorView.jsx';
import SmartQuoteAIView from '../views/SmartQuoteAIView.jsx';
import AppStoreView from '../views/AppStoreView.jsx';
import SettingsView from '../views/SettingsView.jsx';
import SystemLogsView from '../views/SystemLogsView.jsx';
import DocsView from '../views/DocsView.jsx';
import SecurityEventsView from '../views/SecurityEventsView.jsx';
import SecurityCenterView from '../views/SecurityCenterView.jsx';

const WORKSPACE_PERSIST_KEY = 'liongateos_workspace_phase_6_4';

const viewRegistry = {
  home: {
    id: 'home',
    title: 'Command Center',
    component: HomeView,
  },
  'travel-orchestrator': {
    id: 'travel-orchestrator',
    title: 'Travel Orchestrator',
    component: TravelOrchestratorView,
  },
  'smartquote-ai': {
    id: 'smartquote-ai',
    title: 'SmartQuoteAI',
    component: SmartQuoteAIView,
  },
  'app-store': {
    id: 'app-store',
    title: 'App Store',
    component: AppStoreView,
  },
  settings: {
    id: 'settings',
    title: 'OS Settings',
    component: SettingsView,
  },
  'system-logs': {
    id: 'system-logs',
    title: 'System Logs',
    component: SystemLogsView,
  },
  'security-center': {
    id: 'security-center',
    title: 'Security Center',
    component: SecurityCenterView,
  },
  'security-events': {
    id: 'security-events',
    title: 'Security Events',
    component: SecurityEventsView,
  },
  docs: {
    id: 'docs',
    title: 'OS Docs',
    component: DocsView,
  },
};

function getViewDefinition(id) {
  return viewRegistry[id] || null;
}

function loadInitialState() {
  if (typeof window === 'undefined') {
    return {
      views: [viewRegistry.home],
      activeViewId: 'home',
    };
  }

  try {
    const raw = window.localStorage.getItem(WORKSPACE_PERSIST_KEY);
    if (!raw) {
      return {
        views: [viewRegistry.home],
        activeViewId: 'home',
      };
    }
    const parsed = JSON.parse(raw);
    const views = (parsed.views || [])
      .map((id) => getViewDefinition(id))
      .filter(Boolean);
    const activeViewId = parsed.activeViewId && getViewDefinition(parsed.activeViewId)
      ? parsed.activeViewId
      : views[0]?.id || 'home';

    if (!views.length) {
      return {
        views: [viewRegistry.home],
        activeViewId: 'home',
      };
    }

    return {
      views,
      activeViewId,
    };
  } catch (err) {
    console.error('Failed to parse workspace persistence; using default.', err);
    return {
      views: [viewRegistry.home],
      activeViewId: 'home',
    };
  }
}

function persistState(state) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      views: state.views.map((v) => v.id),
      activeViewId: state.activeViewId,
    };
    window.localStorage.setItem(WORKSPACE_PERSIST_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to persist workspace state:', err);
  }
}

function workspaceReducer(state, action) {
  switch (action.type) {
    case 'OPEN_VIEW': {
      const existing = state.views.find((v) => v.id === action.id);
      if (existing) {
        return {
          ...state,
          activeViewId: existing.id,
        };
      }
      const def = getViewDefinition(action.id);
      if (!def) return state;
      return {
        ...state,
        views: [...state.views, def],
        activeViewId: def.id,
      };
    }
    case 'CLOSE_VIEW': {
      const targetId = action.id;
      const remaining = state.views.filter((v) => v.id !== targetId);
      let nextActive = state.activeViewId;

      if (targetId === state.activeViewId) {
        if (remaining.length) {
          const closedIndex = state.views.findIndex((v) => v.id === targetId);
          const fallbackIndex = Math.max(0, closedIndex - 1);
          nextActive = remaining[fallbackIndex]?.id || remaining[0]?.id || null;
        } else {
          nextActive = null;
        }
      }

      return {
        ...state,
        views: remaining,
        activeViewId: nextActive,
      };
    }
    case 'SWITCH_VIEW': {
      if (state.activeViewId === action.id) return state;
      const exists = state.views.some((v) => v.id === action.id);
      if (!exists) return state;
      return {
        ...state,
        activeViewId: action.id,
      };
    }
    case 'SWITCH_RELATIVE': {
      if (!state.views.length) return state;
      const currentIndex = state.views.findIndex(
        (v) => v.id === state.activeViewId
      );
      const index = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex =
        (index + action.offset + state.views.length) % state.views.length;
      return {
        ...state,
        activeViewId: state.views[nextIndex].id,
      };
    }
    default:
      return state;
  }
}

const WorkspaceEngineContext = React.createContext(null);

export function WorkspaceEngineProvider({ children }) {
  const [state, dispatch] = React.useReducer(
    workspaceReducer,
    undefined,
    loadInitialState
  );

  React.useEffect(() => {
    persistState(state);
  }, [state]);

  React.useEffect(() => {
    function onKeyDown(event) {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const ctrlOrMeta = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrMeta && event.altKey && event.key === 'ArrowRight') {
        event.preventDefault();
        dispatch({ type: 'SWITCH_RELATIVE', offset: 1 });
      } else if (ctrlOrMeta && event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        dispatch({ type: 'SWITCH_RELATIVE', offset: -1 });
      } else if (ctrlOrMeta && event.altKey && (event.key === 'w' || event.key === 'W')) {
        event.preventDefault();
        const activeId = state.activeViewId;
        if (activeId) {
          dispatch({ type: 'CLOSE_VIEW', id: activeId });
        }
      } else if (event.altKey) {
        const digit = Number.parseInt(event.key, 10);
        if (!Number.isNaN(digit) && digit >= 1 && digit <= 9) {
          event.preventDefault();
          const index = digit - 1;
          const target = state.views[index];
          if (target) {
            dispatch({ type: 'SWITCH_VIEW', id: target.id });
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.activeViewId, state.views]);

  const openView = React.useCallback((id) => {
    dispatch({ type: 'OPEN_VIEW', id });
  }, []);

  const closeView = React.useCallback((id) => {
    dispatch({ type: 'CLOSE_VIEW', id });
  }, []);

  const switchView = React.useCallback((id) => {
    dispatch({ type: 'SWITCH_VIEW', id });
  }, []);

  const value = React.useMemo(() => {
    const activeViewDefinition = state.activeViewId
      ? getViewDefinition(state.activeViewId)
      : null;

    return {
      views: state.views,
      activeViewId: state.activeViewId,
      activeViewDefinition,
      openView,
      closeView,
      switchView,
    };
  }, [state.views, state.activeViewId, openView, closeView, switchView]);

  return (
    <WorkspaceEngineContext.Provider value={value}>
      {children}
    </WorkspaceEngineContext.Provider>
  );
}

export function useWorkspaceEngine() {
  const ctx = React.useContext(WorkspaceEngineContext);
  if (!ctx) {
    throw new Error('useWorkspaceEngine must be used within WorkspaceEngineProvider');
  }
  return ctx;
}
