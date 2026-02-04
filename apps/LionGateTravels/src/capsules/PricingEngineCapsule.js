import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import Card from '../components/Card';
export default function PricingEngineCapsule({ providerA, providerB, providerC, markup, }) {
    const lowest = Math.min(providerA, providerB, providerC);
    const finalPrice = lowest + markup;
    return (_jsx(Card, { title: "Pricing Engine", accent: "purple", children: _jsxs("div", { style: { fontSize: '0.9rem', color: '#e4e8ff' }, children: [_jsxs("p", { children: ["Provider A: $", providerA.toFixed(2)] }), _jsxs("p", { children: ["Provider B: $", providerB.toFixed(2)] }), _jsxs("p", { children: ["Provider C: $", providerC.toFixed(2)] }), _jsx("hr", { style: { opacity: 0.2 } }), _jsxs("p", { children: ["Lowest Source Cost: $", lowest.toFixed(2)] }), _jsxs("p", { children: ["Your Markup: $", markup.toFixed(2)] }), _jsx("p", { children: _jsxs("strong", { children: ["Final Customer Price: $", finalPrice.toFixed(2)] }) }), _jsxs("p", { children: ["Profit: $", markup.toFixed(2), " per booking"] })] }) }));
}
