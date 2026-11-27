# MAC OS — Disposable VM Validation Plan

## Goal
Verify the starter GNOME Shell extension loads, adds its MAC panel button, toggles Overview on click, and can be cleanly disabled. This plan is not a claim that tests have passed.

## Suggested VM
- Debian Stable with GNOME desktop
- 2 CPU cores, 4 GB RAM, 30 GB virtual disk (adjust for host capacity)
- Snapshot before installing
- GNOME Wayland session; record Shell version

## Install
From the cloned repository root:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
cp -r shell/gnome-extension/* ~/.local/share/gnome-shell/extensions/mac-shell@macos-project/
gnome-extensions enable mac-shell@macos-project
gnome-extensions info mac-shell@macos-project
```

If it fails to load, log out and back in. On Wayland, do not use Alt+F2 then `r` to restart Shell.

## Test checklist
- [ ] Extension listed in GNOME Extensions / `gnome-extensions list`
- [ ] Enable succeeds
- [ ] MAC indicator appears on top panel
- [ ] MAC panel menu opens and shows Overview, App Launcher, Settings, Terminal entries
- [ ] Dock appears centered along bottom of screen
- [ ] Dock shortcut launches the matching app when installed
- [ ] App Launcher overlay opens from panel menu
- [ ] Typing filters installed app list; no-match message appears
- [ ] Clicking a launcher result launches it and dismisses overlay
- [ ] Launcher and dock disappear cleanly when extension is disabled
- [ ] Overview menu item toggles GNOME Overview
- [ ] Settings shortcut launches GNOME Settings if installed
- [ ] Terminal shortcut launches GNOME Terminal if installed
- [ ] No extension errors in logs
- [ ] Disable removes indicator
- [ ] Re-enable restores indicator
- [ ] Log out/in behaves as expected

## Diagnostics
```bash
gnome-shell --version
gnome-extensions list
gnome-extensions info mac-shell@macos-project
journalctl --user -b | grep -i -E 'gnome-shell|mac-shell'
```

## Rollback
```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Do not replace the stock GNOME panel during this milestone. This extension is an additive, reversible experiment.
