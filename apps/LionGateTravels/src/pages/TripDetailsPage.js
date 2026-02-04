import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Page from '../layouts/Page';
import PricingEngineCapsule from '../capsules/PricingEngineCapsule';
import PricingStrategyCapsule from '../capsules/PricingStrategyCapsule';
export default function TripDetailsPage() {
    return (_jsxs(Page, { children: [_jsx("h2", { children: "Trip Details + Pricing Intelligence" }), _jsx(PricingEngineCapsule, { providerA: 280, providerB: 295, providerC: 265, markup: 7 }), _jsx(PricingStrategyCapsule, { lowestCost: 265, competitorA: 310, competitorB: 305, competitorC: 312 })] }));
}
