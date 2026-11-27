# MAC Shell prototype

Experimental GNOME Shell extension. It currently provides:

- `⌘ MAC` top-panel menu with Overview, Settings, and Terminal shortcuts
- Icon-based bottom dock with Files, Settings, Terminal, and Text Editor launch shortcuts, hover feedback, and running-app dots
- Searchable app launcher with application icons, up to 12 results, and Up/Down/Enter/Escape keyboard controls

This is a UI experiment, not a complete desktop replacement. Favorites are currently hard-coded and the dock does not auto-hide. The scaffold has not been VM-tested; GNOME Shell APIs and app IDs can vary.

## Included in the MAC live ISO

The bootable-image pipeline installs the extension system-wide under `/usr/share/gnome-shell/extensions/mac-shell@macos-project`. It stays disabled by default; see [ISO build guide](../../docs/BOOTABLE-ISO.md) and enable it manually in a disposable VM after boot.

## Install in a disposable Debian GNOME VM

From the repository root:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
cp -r shell/gnome-extension/* ~/.local/share/gnome-shell/extensions/mac-shell@macos-project/
gnome-extensions enable mac-shell@macos-project
```

Use GNOME Extensions to enable it if the command does not work. Log out and back in if required. For Wayland, do not attempt to restart Shell using Alt+F2, R.

## Quick test
- MAC menu appears in the top panel.
- Dock is visible near bottom center; click each shortcut to launch its app (if installed).
- MAC menu > App Launcher opens a search overlay; type to filter installed apps, use Up/Down to highlight, Enter to launch, and Escape to close.
- Dock displays app icons and a small dot under running apps; hover feedback should appear.
- MAC menu > Show Overview toggles GNOME Overview.
- Disable the extension; panel indicator, dock and launcher should disappear.

## Disable / remove
```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Keep the stock GNOME panel and test only in a disposable VM. See [VM test plan](../docs/SHELL-VM-TEST.md).
