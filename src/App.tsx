import { Routes, Route, Navigate } from "react-router-dom";
import WorkspaceHost from "./components/WorkspaceHost";
import Dashboard from "./system/dashboard/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route element={<WorkspaceHost />}>
        <Route path="/hub" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/hub" replace />} />
      </Route>
    </Routes>
  );
}