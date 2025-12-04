import type { AppNavItem } from "../../components/AppRegistry";
import type { OsRoute } from "./OSRouteManager";
import { getRouteForItem } from "./OSRouteManager";

export const createNavClickHandler = (
  navigate: (route: OsRoute) => void,
  item: AppNavItem,
) => {
  const target = getRouteForItem(item);
  return () => navigate(target);
};
