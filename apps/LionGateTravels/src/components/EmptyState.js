import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const EmptyState = ({ title, onCreate }) => (_jsxs("div", { className: "to-empty", children: [_jsx("div", { className: "to-empty-title", children: title }), _jsx("button", { className: "to-primary-btn", onClick: onCreate, children: "New" })] }));
