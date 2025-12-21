export type AppRegistration = {
  id: string;
  name: string;
  icon: string; // Phase 1: emoji placeholder; OS-owned icons later
  description: string;
  defaultRoute: string;
};

export type SystemRegistration = {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultRoute: string;
};

export const SYSTEM_REGISTRY: SystemRegistration[] = [
  {
    id: "hub",
    name: "Workspace Hub",
    icon: "🧭",
    description: "Central dashboard and workspace launcher.",
    defaultRoute: "/hub",
  },
];

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
