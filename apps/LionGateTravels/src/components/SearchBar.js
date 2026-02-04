import { jsx as _jsx } from "react/jsx-runtime";
export const SearchBar = ({ value, onChange, placeholder }) => (_jsx("input", { className: "to-input", placeholder: placeholder || "Search", value: value, onChange: e => onChange(e.target.value) }));
