import * as React from "react";
import { APP_NAV_ITEMS, type AppNavItem } from "../../components/AppRegistry";

export type OsRoute = string;

const DEFAULT_ROUTE: OsRoute = "/";

const resolveInitialRoute = (): OsRoute => {
  if (typeof window === "undefined") {
    return DEFAULT_ROUTE;
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

const getItemForRoute = (route: OsRoute): AppNavItem => {
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
