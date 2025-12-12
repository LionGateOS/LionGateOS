LionGateOS – Shell Controller · Baseline 02
==========================================

This directory defines the OS-level shell controller metadata.

It does NOT change how your current UI renders yet.
It only formalizes how the shell should think about:

• Layout regions (top bar, sidebar, dock, workspace)
• Theme engine integration points
• App registry source of truth
• Recommended React entry (OSWorkspaceShell) and bridge module (src/system/osShellBridge.ts)

Future update packs will add and wire the actual React components to this metadata.
