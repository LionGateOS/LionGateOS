LionGateOS Theme Engine – Initialization (Phase 5)
=================================================

This folder initializes the LionGateOS Theme Engine for Option A
(Neutral Professional baseline). It defines:

  • theme/engine/theme-tokens.json
      - style mode definitions
      - token sets for neutral dark workspace
      - default styleMode: soft-slate-os-default

  • theme/iconpacks/default/iconpack.meta.json
      - logical icon mappings for shell entities
      - relies on lucide-react; no SVG assets required yet

  • theme/wallpapers/default/wallpapers.meta.json
      - neutral gradient-based wallpaper definition
      - marked as the default wallpaper

The React-level bridge is provided in:

  • src/theme/provider/ThemeProvider.js

At this stage, the ThemeProvider is safe and non-invasive. It only
exposes context and does not yet re-wire the shell. Future update
packs can wrap the shell root with ThemeProvider and connect
controls in the Theme Engine UI without changing this structure.
