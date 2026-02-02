import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { load, save } from "./data/store";
import { Shell } from "./components/Shell";
import { Search } from "./components/Search";

import Trips from "./pages/Trips";
import Quotes from "./pages/Quotes";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Overview from "./pages/Overview";

export default function App() {
  const [state, setState] = React.useState(load());
  React.useEffect(() => save(state), [state]);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/overview" element={<Overview state={state} setState={setState} />} />
        <Route path="/trips" element={<Trips state={state} setState={setState} />} />
        <Route path="/quotes" element={<Quotes state={state} setState={setState} />} />
        <Route path="/clients" element={<Clients state={state} setState={setState} />} />
        <Route path="/tasks" element={<Tasks state={state} setState={setState} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
