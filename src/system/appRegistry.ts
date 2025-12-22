export type AppId = "smartquote" | "travels";

export interface AppEntry {
  id: AppId;
  title: string;
  url: string;
}

export const APPS: Record<AppId, AppEntry> = {
  smartquote: {
    id: "smartquote",
    title: "SmartQuote AI",
    url: "https://smartquoteai-estimator.netlify.app/",
  },
  travels: {
    id: "travels",
    title: "LionGate Travels",
    url: "https://liongateostravels.com/",
  },
};

export function getAppById(id: AppId): AppEntry | undefined {
  return APPS[id];
}