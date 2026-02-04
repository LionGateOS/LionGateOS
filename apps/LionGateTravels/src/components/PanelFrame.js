import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import './PanelFrame.css';
export const PanelFrame = ({ moduleId, title, children, coreAPI, className = '', headerActions, }) => {
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
        return (_jsxs("div", { className: `lg-panel-frame lg-panel-frame--blackboard ${className}`, style: {
                position: 'absolute',
                left: panelState.x,
                top: panelState.y,
                width: panelState.width,
                height: panelState.height,
                zIndex: panelState.zIndex,
            }, "data-module-id": moduleId, children: [_jsxs("div", { className: "lg-panel-header", children: [_jsx("div", { className: "lg-panel-title", children: title }), _jsxs("div", { className: "lg-panel-actions", children: [headerActions, _jsx("button", { className: "lg-panel-action-btn", onClick: handleMinimize, "aria-label": "Minimize", children: _jsx("span", { className: "lg-icon", children: "\u2212" }) }), _jsx("button", { className: "lg-panel-action-btn", onClick: handleMaximize, "aria-label": panelState.maximized ? 'Restore' : 'Maximize', children: _jsx("span", { className: "lg-icon", children: panelState.maximized ? '❐' : '□' }) })] })] }), !panelState.minimized && (_jsx("div", { className: "lg-panel-content", children: children }))] }));
    }
    // LEGACY MODE: Render as full-page content
    return (_jsx("div", { className: `lg-panel-frame lg-panel-frame--legacy ${className}`, "data-module-id": moduleId, children: children }));
};
