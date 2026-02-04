import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import Card from '../components/Card';
export default function PricingStrategyCapsule({ lowestCost, competitorA, competitorB, competitorC, }) {
    const competitors = [competitorA, competitorB, competitorC];
    const lowestCompetitor = Math.min(...competitors);
    // Simple smart markup logic: aim to be $5 cheaper than the lowest competitor
    const targetPrice = lowestCompetitor - 5;
    const markup = targetPrice - lowestCost;
    const finalPrice = lowestCost + markup;
    return (_jsx(Card, { title: "Pricing Strategy AI", accent: "blue", children: _jsxs("div", { style: { fontSize: '0.9rem', color: '#e4e8ff' }, children: [_jsxs("p", { children: ["Lowest Provider Cost: $", lowestCost.toFixed(2)] }), _jsxs("p", { children: ["Competitor A: $", competitorA.toFixed(2)] }), _jsxs("p", { children: ["Competitor B: $", competitorB.toFixed(2)] }), _jsxs("p", { children: ["Competitor C: $", competitorC.toFixed(2)] }), _jsx("hr", { style: { opacity: 0.2 } }), _jsxs("p", { children: ["Lowest Competitor Price: $", lowestCompetitor.toFixed(2)] }), _jsxs("p", { children: ["Recommended Customer Price: $", finalPrice.toFixed(2)] }), _jsxs("p", { children: ["Your Profit: $", markup.toFixed(2), " per booking"] })] }) }));
}
