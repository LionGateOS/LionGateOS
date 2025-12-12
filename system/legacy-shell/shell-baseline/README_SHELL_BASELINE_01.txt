LionGateOS – Shell Baseline · Update Pack 01
===========================================

This configuration file set defines the baseline model for the LionGateOS shell.

Key points:

• LionGateOS acts as the operating system layer and workspace frame.
• Apps such as SmartQuoteAi Pro and Smart Code AI are independent projects.
• Apps can run both:
    – Inside LionGateOS as modular apps
    – Outside LionGateOS as standalone tools
• Apps integrate into the OS under:  apps/<AppName>/ 
  without mixing their internal code into the OS shell.

Theme Engine:

• Icon packs live under:       theme/iconpacks/<PackName>/
• Wallpaper packs live under:  theme/wallpapers/
• Theme engine config lives under:  theme/engine/
• OS style modes define structural UI (round vs square, blur, elevation, animation density, etc.)
  and must not be overridden by theme packs.

This update pack does not modify your existing UI code or shell layout.
It adds a structured baseline manifest under system/shell-baseline/ that future UI work will read from.

Safe usage:

• You can extract this update pack on top of I:\LionGateOS\
• It only adds files under:  LionGateOS\system\shell-baseline\
• No existing files are overwritten by this pack.
