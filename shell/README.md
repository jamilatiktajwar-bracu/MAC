# MAC Shell prototype

Experimental GNOME Shell extension. Current features:

- `⌘ MAC` top-panel menu: Overview, launcher, Files, Web, Settings, Terminal, About
- Centered icon dock: Files, Web browser, Text Editor, Settings, Terminal, and app launcher
- Hover/focus feedback, running-app dots, and optional native icon magnification
- MAC panel menu switch to persistently enable/disable dock magnification with GSettings
- Native libadwaita MAC Desktop Settings for dock auto-hide, magnification, and editable favorite desktop IDs with drag-and-drop reordering
- Configurable dock favorites that rebuild immediately when saved
- Optional dock auto-hide with bottom-edge pointer reveal
- MAC menu shortcuts to open Home and Downloads in Files
- Searchable installed-app launcher with icons and Up/Down/Enter/Escape controls
- Configurable keyboard shortcut (default Super+K) to open the launcher
- Dock repositioning when the primary monitor layout changes

The shell is still an additive extension over GNOME; it does not replace the compositor or window manager. Favorites can be added from installed applications, removed, and reordered by dragging rows or using accessible Up/Down buttons. Auto-hide and preferences are experimental and have not yet been VM-tested.

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
- Dock magnification and auto-hide settings persist through the extension's GSettings schema.
- MAC Desktop Settings opens from the panel menu or application grid.
- Favorite desktop IDs can be added, removed, saved, and restored to defaults.
- Favorite rows can be dragged to reorder; Up/Down buttons provide a keyboard-accessible alternative.
- Saving favorites rebuilds the Dock without restarting GNOME Shell.
- MAC panel menu opens the Home and Downloads folders in Files.
- Disabling the extension removes its panel item, dock, and launcher.

## Disable / remove

```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

See the [VM validation plan](../docs/SHELL-VM-TEST.md).