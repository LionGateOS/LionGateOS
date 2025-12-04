import React,{useState} from "react";

const NAV_SECTIONS=[
 {id:"core",label:"Core",items:[
   {id:"dashboard",label:"Command Center"},
   {id:"workspace-hub",label:"Workspace Hub"},
 ]},
 {id:"apps",label:"Apps",items:[
   {id:"smartquote",label:"SmartQuote AI"},
   {id:"travel-orchestrator",label:"Travel Orchestrator"},
 ]},
 {id:"system",label:"System",items:[
   {id:"settings",label:"System Settings"},
   {id:"theme-engine",label:"Theme Engine"},
   {id:"shell-diagnostics",label:"Shell Diagnostics"},
 ]},
];

export default function Sidebar(){
 const [active,setActive]=useState("dashboard");
 const click=id=>{
   setActive(id);
   window.dispatchEvent(new CustomEvent("os-shell:navigate",{detail:{routeId:id}}));
 };
 return(
   <aside className="os-sidebar os-sidebar-expanded">
     <div className="os-sidebar-header">
       <span className="os-sidebar-title">Navigation</span>
       <span className="os-sidebar-mode">Expanded</span>
     </div>
     <nav className="os-sidebar-nav">
      {NAV_SECTIONS.map(section=>(
        <div key={section.id} className="os-sidebar-section">
           <div className="os-sidebar-section-label">{section.label}</div>
           <ul className="os-sidebar-list">
            {section.items.map(item=>(
              <li key={item.id}>
               <button
                 className={
                   "os-sidebar-item"+(active===item.id?" os-sidebar-item-active":"")
                 }
                 onClick={()=>click(item.id)}
               >
                 <span className="os-sidebar-bullet">•</span>
                 <span className="os-sidebar-item-label">{item.label}</span>
               </button>
              </li>
            ))}
           </ul>
        </div>
      ))}
     </nav>
   </aside>
 );
}
