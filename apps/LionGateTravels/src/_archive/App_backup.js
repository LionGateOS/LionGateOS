import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Shell, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Search, {}) }), _jsx(Route, { path: "/overview", element: _jsx(Overview, { state: state, setState: setState }) }), _jsx(Route, { path: "/trips", element: _jsx(Trips, { state: state, setState: setState }) }), _jsx(Route, { path: "/quotes", element: _jsx(Quotes, { state: state, setState: setState }) }), _jsx(Route, { path: "/clients", element: _jsx(Clients, { state: state, setState: setState }) }), _jsx(Route, { path: "/tasks", element: _jsx(Tasks, { state: state, setState: setState }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
