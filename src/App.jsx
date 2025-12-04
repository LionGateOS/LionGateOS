import React from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import WorkspaceHost from "./components/WorkspaceHost";

export default function App() {
  return (
    <div className="os-root">
      <Topbar />
      <div className="os-main">
        <Sidebar />
        <WorkspaceHost />
      </div>
    </div>
  );
}
