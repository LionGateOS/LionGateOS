import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import themeMeta from "../../../theme/engine/theme-tokens.json";

type StyleModeId = string;

type ThemeEngineContextValue = {
  styleMode: StyleModeId;
  setStyleMode: (id: StyleModeId) => void;
  meta: typeof themeMeta;
};

const ThemeEngineContext = createContext<ThemeEngineContextValue>({
  styleMode: themeMeta.defaults?.styleMode ?? "soft-slate-os-default",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStyleMode: () => {},
  meta: themeMeta,
});

type Props = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [styleMode, setStyleMode] = useState<StyleModeId>(
    themeMeta.defaults?.styleMode ?? "soft-slate-os-default"
  );

  const value = useMemo(
    () => ({
      styleMode,
      setStyleMode,
      meta: themeMeta,
    }),
    [styleMode]
  );

  return (
    <ThemeEngineContext.Provider value={value}>
      {children}
    </ThemeEngineContext.Provider>
  );
};

export const useThemeEngine = (): ThemeEngineContextValue =>
  useContext(ThemeEngineContext);
