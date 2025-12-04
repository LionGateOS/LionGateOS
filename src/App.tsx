
import React from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import WorkspaceHost from "./components/WorkspaceHost";
import ErrorBoundary from "./components/ErrorBoundary";

const App:React.FC=()=>(
 <ErrorBoundary fallback={<div className='os-fallback'>Shell auto-recovered</div>}>
  <div className='os-root'>
    <Topbar/>
    <div className='os-main'>
      <ErrorBoundary><Sidebar/></ErrorBoundary>
      <ErrorBoundary><WorkspaceHost/></ErrorBoundary>
    </div>
  </div>
 </ErrorBoundary>
);

export default App;
