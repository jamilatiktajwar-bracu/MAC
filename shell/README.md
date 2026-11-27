# MAC Shell prototype

Experimental GNOME Shell extension. Current features:

- `⌘ MAC` top-panel menu: Overview, launcher, Files, Web, Settings, Terminal, About
- Centered icon dock: Files, Web browser, Text Editor, Settings, Terminal, and app launcher
- Hover/focus feedback and running-app dots
- Searchable installed-app launcher with icons and Up/Down/Enter/Escape controls\n- Configurable keyboard shortcut (default Super+K) to open the launcher
- Dock repositioning when the primary monitor layout changes

The shell is still an additive extension over GNOME; it does not replace the compositor or window manager. The app favorites are hard-coded, dock auto-hide and drag-to-reorder are not implemented, and compatibility has not yet been VM-tested.

## Included in the MAC live ISO

The extension is installed system-wide and configured to be enabled by the live environment's dconf defaults. If the session does not load it automatically, enable it in a disposable VM:

```bash
gnome-extensions enable mac-shell@macos-project
```

See [ISO build guide](../docs/BOOTABLE-ISO.md).

## Install in a disposable Debian GNOME VM

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
cp -r shell/gnome-extension/* ~/.local/share/gnome-shell/extensions/mac-shell@macos-project/
gnome-extensions enable mac-shell@macos-project
```

Log out/in if needed. On Wayland, don't restart Shell with Alt+F2, R.

## Quick test

- MAC menu and About item appear on the top panel.
- Dock appears centered at the primary monitor's bottom edge.
- Files, Web, Text Editor, Settings and Terminal launch if installed.
- App-grid button and Super+K open launcher; typing filters; arrows change selection; Enter launches; Escape closes.
- Running favorites have a dot indicator.
- Dock remains correctly positioned after display/monitor changes.
- Disabling the extension removes its panel item, dock, and launcher.

## Disable / remove

```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

See the [VM validation plan](../docs/SHELL-VM-TEST.md).