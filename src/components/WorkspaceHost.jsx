import React from 'react';
import { useWorkspaceEngine } from '../engine/workspaceEngine.jsx';

export default function WorkspaceHost() {
  const { activeViewDefinition } = useWorkspaceEngine();

  if (!activeViewDefinition) {
    return (
      <div>
        <h2>No active view</h2>
        <p className="text-soft">
          Use the sidebar to open a workspace view. It will appear here as a tab.
        </p>
      </div>
    );
  }

  const ViewComponent = activeViewDefinition.component;
  return <ViewComponent />;
}
