import React from "react";
import type { AppNavItem } from "./AppRegistry";

type NavItemRendererProps = {
  item: AppNavItem;
  isActive?: boolean;
};

const iconSize = 18;

const IconOverview: React.FC = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="3.5"
      y="4.5"
      width="17"
      height="15"
      rx="3"
      ry="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
    <path
      d="M7 9h4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
    />
    <path
      d="M7 13h2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      opacity="0.9"
    />
    <circle
      cx="16.2"
      cy="12"
      r="2.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

const IconWorkspaces: React.FC = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="3.5"
      y="4"
      width="7.5"
      height="7.5"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
    <rect
      x="13"
      y="4"
      width="7.5"
      height="7.5"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      opacity="0.9"
    />
    <rect
      x="8.5"
      y="12.5"
      width="7"
      height="7"
      rx="2"
      ry="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

const IconTheme: React.FC = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="12"
      cy="12"
      r="5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
    <path
      d="M12 3v2.4M12 18.6V21M4.5 12H7M17 12h2.5M7 7l1.7 1.7M15.3 15.3 17 17M15.3 8.7 17 7M7 17l1.7-1.7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
    />
  </svg>
);

const IconSettings: React.FC = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
    />
    <path
      d="M4.5 12.8 6 13.2l.6 1.5-1 1.8 1.4 1.4 1.8-1 1.5.6.4 1.5h2l.4-1.5 1.5-.6 1.8 1 1.4-1.4-1-1.8.6-1.5 1.5-.4v-2l-1.5-.4-.6-1.5 1-1.8-1.4-1.4-1.8 1-1.5-.6L13 4.5h-2l-.4 1.5-1.5.6-1.8-1-1.4 1.4 1 1.8-.6 1.5-1.5.4v2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconThemeMode: React.FC = () => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6.2 5.4A7.2 7.2 0 0 0 12 20a7.2 7.2 0 0 0 6.4-3.9A6.4 6.4 0 0 1 12.2 4 6.4 6.4 0 0 1 6.2 5.4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const iconFor = (icon: AppNavItem["icon"]): JSX.Element => {
  switch (icon) {
    case "overview":
      return <IconOverview />;
    case "workspaces":
      return <IconWorkspaces />;
    case "theme":
      return <IconTheme />;
    case "settings":
      return <IconSettings />;
    case "theme-mode":
      return <IconThemeMode />;
    default:
      return <IconOverview />;
  }
};

export const NavItemRenderer: React.FC<NavItemRendererProps> = ({
  item,
  isActive,
}) => {
  const navClasses = [
    "lgos-nav-softsquare",
    isActive ? "lgos-nav-softsquare--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="lgos-nav-item">
      <button
        type="button"
        className={navClasses}
        aria-label={item.label}
        title={item.label}
      >
        <span className="lgos-nav-icon">{iconFor(item.icon)}</span>
        <span className="lgos-nav-label">{item.label}</span>
      </button>
      <div className="lgos-nav-tooltip">{item.label}</div>
    </div>
  );
};
