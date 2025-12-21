export type AppRegistration = {
  id: string;
  name: string;
  icon: string; // Phase 1: emoji placeholder; OS-owned icons later
  description: string;
  defaultRoute: string;
};

export const APP_REGISTRY: AppRegistration[] = [
  {
    id: "smartquote",
    name: "SmartQuote AI",
    icon: "🧾",
    description: "Create and manage estimates and quotes.",
    defaultRoute: "/smartquote",
  },
  {
    id: "travels",
    name: "LionGate Travels",
    icon: "✈️",
    description: "Plan trips and itineraries inside LionGateOS.",
    defaultRoute: "/travels",
  },
];
