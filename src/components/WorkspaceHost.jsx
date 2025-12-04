import React,{useState,useEffect} from "react";
const PANELS={
 "dashboard":{title:"Command Center",body:"High-level overview of LionGateOS activity and status."},
 "workspace-hub":{title:"Workspace Hub",body:"Entry point for OS workspaces, shells, and tools."},
 "smartquote":{title:"SmartQuote AI",body:"Shell bridge into the SmartQuote AI app."},
 "travel-orchestrator":{title:"Travel Orchestrator",body:"Shell bridge into the Travel Orchestrator app."},
 "settings":{title:"System Settings",body:"Global OS configuration and preferences."},
 "theme-engine":{title:"Theme Engine",body:"Manage palettes, wallpapers, and style modes."},
 "shell-diagnostics":{title:"Shell Diagnostics",body:"Phase 5 shell health, routing, and mount status."},
};
const DEFAULT="dashboard";
export default function WorkspaceHost(){
 const [active,setActive]=useState(DEFAULT);
 useEffect(()=>{
  const handler=e=>{ if(e?.detail?.routeId) setActive(e.detail.routeId); };
  window.addEventListener("os-shell:navigate",handler);
  return()=>window.removeEventListener("os-shell:navigate",handler);
 },[]);
 const panel=PANELS[active]??PANELS[DEFAULT];
 return(
  <main className="os-workspace-host">
    <div className="os-workspace-header">
      <h1 className="os-workspace-title">{panel.title}</h1>
      <span className="os-workspace-tag">Workspace</span>
    </div>
    <section className="os-workspace-body">
      <p className="os-workspace-text">{panel.body}</p>
    </section>
  </main>
 );
}
