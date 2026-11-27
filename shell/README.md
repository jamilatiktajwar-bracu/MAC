# MAC Shell prototype

Experimental GNOME Shell extension. It currently provides:

- `⌘ MAC` top-panel menu with Overview, Settings, and Terminal shortcuts
- A simple bottom dock with Files, Settings, Terminal, and Text Editor launch shortcuts
- A searchable app-launcher overlay listing installed visible applications (up to 12 matching entries)

This is a UI experiment, not a complete desktop replacement. It does not yet provide window-running indicators, favorites configuration, launcher keyboard navigation, or auto-hide. The scaffold has not been VM-tested. GNOME Shell APIs and app IDs can vary.

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
- MAC menu > App Launcher opens a search overlay; type to filter installed apps and click an entry.
- MAC menu > Show Overview toggles GNOME Overview.
- Disable the extension; panel indicator, dock and launcher should disappear.

## Disable / remove
```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Keep the stock GNOME panel and test only in a disposable VM. See [VM test plan](../docs/SHELL-VM-TEST.md).
