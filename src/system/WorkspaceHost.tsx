import React from "react";
import type { OsRoute } from "./OSRouteManager";
import { OverviewPanel } from "../modules/overview/OverviewPanel";
import { WorkspacesPanel } from "../modules/workspaces/WorkspacesPanel";
import { ThemeEnginePanel } from "../modules/theme/ThemeEnginePanel";
import { SettingsPanel } from "../modules/settings/SettingsPanel";
import { ThemeModePanel } from "../modules/theme-mode/ThemeModePanel";

export type WorkspaceHostProps = {
  route: OsRoute;
};

const resolvePanel = (route: OsRoute): JSX.Element => {
  switch (route) {
    case "/workspaces":
      return <WorkspacesPanel />;
    case "/theme":
      return <ThemeEnginePanel />;
    case "/settings":
      return <SettingsPanel />;
    case "/theme-mode":
      return <ThemeModePanel />;
    case "/":
    default:
      return <OverviewPanel />;
  }
};

export const WorkspaceHost: React.FC<WorkspaceHostProps> = ({ route }) => {
  const panel = resolvePanel(route);

  return (
    <section className="lgos-workspace">
      <div className="lgos-workspace__inner">
        <div className="lgos-workspace__placeholder">{panel}</div>
      </div>
    </section>
  );
};

export default WorkspaceHost;
