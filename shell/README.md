# MAC Shell prototype

This is a reversible GNOME Shell extension starter. It adds a `⌘ MAC` top-panel menu with:
- **Show Overview** — toggles GNOME Overview
- **Open Settings** — launches GNOME Settings, if installed
- **Open Terminal** — launches GNOME Terminal, if installed

It does **not** replace GNOME Shell, the panel, compositor, or window manager. The panel menu and app shortcuts are experimental and have not been VM-tested yet.

## Install in a Debian GNOME VM

From the repository root:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
cp -r shell/gnome-extension/* ~/.local/share/gnome-shell/extensions/mac-shell@macos-project/
```

Enable using GNOME Extensions app, or:

```bash
gnome-extensions enable mac-shell@macos-project
```

Log out and back in if needed. For Wayland, do not attempt to restart GNOME Shell using Alt+F2, R.

## Disable / remove

```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Only test in a disposable VM. GNOME extension APIs and desktop app IDs vary by Shell version and distribution; validate the scaffold on the target Debian version before claiming compatibility. See [VM test plan](../docs/SHELL-VM-TEST.md).
