# MAC Shell prototype

This is a reversible GNOME Shell extension starter. It currently adds a simple `⌘ MAC` indicator to the top panel; clicking it toggles the GNOME overview. It does **not** replace GNOME Shell, the panel, or the window manager yet.

## Install in a Debian GNOME VM

From the repository root:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
cp -r shell/gnome-extension/* ~/.local/share/gnome-shell/extensions/mac-shell@macos-project/
```

Enable with GNOME Extensions app, or:

```bash
gnome-extensions enable mac-shell@macos-project
```

Log out and back in if needed. For Wayland, do not attempt to restart GNOME Shell using Alt+F2, R.

Disable / remove:

```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Only test in a disposable VM. GNOME extension APIs vary by Shell version; this starter should be validated on the target Debian version before claiming compatibility.
