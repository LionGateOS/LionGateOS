import * as React from "react";
import { APP_NAV_ITEMS, type AppNavItem } from "../../components/AppRegistry";

export type OsRoute = string;

const DEFAULT_ROUTE: OsRoute = "/";
const LAST_ROUTE_KEY = "liongateos:lastRoute";

const resolveInitialRoute = (): OsRoute => {
  if (typeof window === "undefined") {
    return DEFAULT_ROUTE;
  }

  try {
    const stored = window.localStorage.getItem(LAST_ROUTE_KEY);
    if (stored && APP_NAV_ITEMS.some((item) => item.route === stored)) {
      return stored as OsRoute;
    }
  } catch {
    // ignore storage issues and fall back to URL / default
  }

  const path = window.location.pathname || "/";
  const match = APP_NAV_ITEMS.find((item) => item.route === path);
  if (match && match.route) {
    return match.route;
  }
  return DEFAULT_ROUTE;
};

export const getRouteForItem = (item: AppNavItem): OsRoute => {
  return item.route ?? DEFAULT_ROUTE;
};

export const getItemForRoute = (route: OsRoute): AppNavItem => {
  const match = APP_NAV_ITEMS.find((item) => item.route === route);
  return match ?? APP_NAV_ITEMS[0];
};

export const getActiveIdForRoute = (route: OsRoute): string => {
  return getItemForRoute(route).id;
};

export const useOsRoute = () => {
  const [route, setRoute] = React.useState<OsRoute>(() => resolveInitialRoute());

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setRoute(resolveInitialRoute());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LAST_ROUTE_KEY, route);
    } catch {
      // ignore storage failures to avoid crashing the shell
    }
  }, [route]);

  const navigate = React.useCallback((next: OsRoute) => {
    if (typeof window !== "undefined") {
      if (window.location.pathname !== next) {
        window.history.pushState({}, "", next);
      }
    }
    setRoute(next);
  }, []);

  return { route, navigate };
};
