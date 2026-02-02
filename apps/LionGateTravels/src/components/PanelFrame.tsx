/**
 * PANEL FRAME COMPONENT
 * 
 * Wraps Travels module content to support:
 * - Blackboard/draggable mode
 * - Theme-reactive borders and glow
 * - Consistent panel styling across LionGateOS
 * 
 * This component is controlled by LionGateOS Core theming.
 * NO hardcoded colors or styles allowed.
 */

import React from 'react';
import { LionGateOS_Core_API } from '../core/liongateos.api';
import './PanelFrame.css';

export interface PanelFrameProps {
  moduleId: string;
  title: string;
  children: React.ReactNode;
  coreAPI: LionGateOS_Core_API;
  
  // Optional overrides
  className?: string;
  headerActions?: React.ReactNode;
}

export const PanelFrame: React.FC<PanelFrameProps> = ({
  moduleId,
  title,
  children,
  coreAPI,
  className = '',
  headerActions,
}) => {
  const [isBlackboardMode, setIsBlackboardMode] = React.useState(false);
  const [panelState, setPanelState] = React.useState(coreAPI.layout.getPanelState());
  const [theme, setTheme] = React.useState(coreAPI.theme.getCurrentTheme());
  
  // Subscribe to theme changes
  React.useEffect(() => {
    const unsubscribe = coreAPI.theme.onThemeChange((newTheme) => {
      setTheme(newTheme);
      
      // Apply theme variables to root
      Object.entries(newTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    });
    
    return unsubscribe;
  }, [coreAPI]);
  
  // Check Blackboard mode
  React.useEffect(() => {
    setIsBlackboardMode(coreAPI.layout.isBlackboardMode());
  }, [coreAPI]);
  
  // Register with layout system
  React.useEffect(() => {
    coreAPI.layout.registerModule({
      moduleId,
      resizable: true,
      draggable: true,
      minSize: { width: 400, height: 300 },
    });
  }, [moduleId, coreAPI]);
  
  const handleMinimize = () => {
    if (panelState) {
      coreAPI.layout.updatePanelState({ minimized: !panelState.minimized });
      setPanelState({ ...panelState, minimized: !panelState.minimized });
    }
  };
  
  const handleMaximize = () => {
    if (panelState) {
      coreAPI.layout.updatePanelState({ maximized: !panelState.maximized });
      setPanelState({ ...panelState, maximized: !panelState.maximized });
    }
  };
  
  // BLACKBOARD MODE: Render as draggable panel
  if (isBlackboardMode && panelState) {
    return (
      <div
        className={`lg-panel-frame lg-panel-frame--blackboard ${className}`}
        style={{
          position: 'absolute',
          left: panelState.x,
          top: panelState.y,
          width: panelState.width,
          height: panelState.height,
          zIndex: panelState.zIndex,
        }}
        data-module-id={moduleId}
      >
        {/* Panel Header */}
        <div className="lg-panel-header">
          <div className="lg-panel-title">{title}</div>
          <div className="lg-panel-actions">
            {headerActions}
            <button
              className="lg-panel-action-btn"
              onClick={handleMinimize}
              aria-label="Minimize"
            >
              <span className="lg-icon">−</span>
            </button>
            <button
              className="lg-panel-action-btn"
              onClick={handleMaximize}
              aria-label={panelState.maximized ? 'Restore' : 'Maximize'}
            >
              <span className="lg-icon">{panelState.maximized ? '❐' : '□'}</span>
            </button>
          </div>
        </div>
        
        {/* Panel Content */}
        {!panelState.minimized && (
          <div className="lg-panel-content">
            {children}
          </div>
        )}
      </div>
    );
  }
  
  // LEGACY MODE: Render as full-page content
  return (
    <div
      className={`lg-panel-frame lg-panel-frame--legacy ${className}`}
      data-module-id={moduleId}
    >
      {children}
    </div>
  );
};
