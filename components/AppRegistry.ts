export type NavSection = "top" | "bottom";

export type AppNavItem = {
  id: string;
  label: string;
  icon: "overview" | "workspaces" | "theme" | "settings" | "theme-mode";
  section: NavSection;
  route?: string;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    id: "overview",
    label: "System Overview",
    icon: "overview",
    section: "top",
    route: "/",
  },
  {
    id: "workspaces",
    label: "Workspaces",
    icon: "workspaces",
    section: "top",
    route: "/workspaces",
  },
  {
    id: "theme",
    label: "Theme Engine",
    icon: "theme",
    section: "top",
    route: "/theme",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    section: "bottom",
    route: "/settings",
  },
  {
    id: "theme-mode",
    label: "Theme Mode",
    icon: "theme-mode",
    section: "bottom",
    route: "/theme-mode",
  },
];

export const TOP_NAV_ITEMS = APP_NAV_ITEMS.filter(
  (item) => item.section === "top",
);

export const BOTTOM_NAV_ITEMS = APP_NAV_ITEMS.filter(
  (item) => item.section === "bottom",
);
