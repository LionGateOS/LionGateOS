import { useThemeEngine } from "../provider/ThemeProvider";

export const useStyleMode = () => {
  const { styleMode, setStyleMode, meta } = useThemeEngine();
  const modes = meta?.styleModes ?? [];

  return {
    styleMode,
    setStyleMode,
    modes,
  };
};
