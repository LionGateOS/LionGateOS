import { useThemeEngine } from "../provider/ThemeProvider";

export const useTokens = () => {
  const { styleMode, meta } = useThemeEngine();
  const modes = meta?.styleModes || [];
  const current = modes.find(m => m.id === styleMode) || modes[0];
  return current?.tokens || {};
};