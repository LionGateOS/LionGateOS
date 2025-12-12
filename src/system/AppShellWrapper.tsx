
import React from "react";
import { useSidebarState } from "./SidebarState";
import { useOsRoute } from "./OSRouteManager";
import { WorkspaceHost } from "./WorkspaceHost";
import { createNavClickHandler } from "./NavActionLayer";

export const AppShellWrapper = () => {
  const { expanded } = useSidebarState();
  const route = useOsRoute();

  return (
    <div className={`lgos-shell ${expanded ? "lgos-shell--expanded" : ""}`}>
      <WorkspaceHost route={route} onNavClick={createNavClickHandler()} />
    </div>
  );
};
