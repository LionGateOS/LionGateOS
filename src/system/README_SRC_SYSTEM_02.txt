LionGateOS – src/system/ Layer
==============================

This folder is reserved for the React/TypeScript system layer that will:

• Bridge shell metadata from system/shell-baseline/ and system/shell-controller/
• Load theme engine configuration from system/theme-engine/
• Load app registry information from system/app-registry/
• Expose hooks/components to the rest of the UI (e.g., OS shell layout, app list, theme toggles)

No runtime code has been added yet in this update.
This avoids any risk of breaking existing builds while the contracts are being shaped.


New in Shell Update Pack 03:
- osShellBridge.ts defines shell state shapes and helpers.
- themeBridge.ts normalizes theme engine metadata.
- appRegistryBridge.ts converts app registry metadata into shell integrations.
- ui-shell/ components provide a baseline OS workspace frame.

New in Shell Update Pack 04:
- osShellLoader.ts loads and normalizes shell, theme, and app registry metadata.
- ui-shell/OSShellEntry.tsx provides a safe, optional shell entrypoint component.
- No existing files are modified; this pack is additive only.
