LionGateOS – Phase 3B Forced Cleanup (PowerShell)
===================================================

This script force-deletes old ConstructOS / StudioAI legacy folders
that Windows may be protecting:

  - legacy-shell
  - os-shell-legacy
  - preview

How to use:

1. Make sure this script is located directly in your main LionGateOS
   folder, for example:

      I:\LionGateOS\force_delete_legacy.ps1

2. Right-click on:

      force_delete_legacy.ps1

   and choose:

      "Run with PowerShell"

3. A blue PowerShell window will open, explain what it will do, and ask:

      Press Y then Enter to continue, or anything else to cancel

4. Type:

      Y

   and press Enter.

5. The script will attempt to remove ONLY the three folders listed
   above, and only from the current LionGateOS directory.

6. When it says "Phase 3B cleanup completed", you can close the window.

If Windows shows a security warning about scripts, choose the option
that allows this script to run a single time.
