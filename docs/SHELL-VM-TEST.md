# MAC OS — Disposable VM validation

## Goal

Boot the live ISO and test the MAC wallpaper/defaults, GNOME extension, top-panel menu, dock, app launcher, and safe disable/rollback. This checklist is not a report of successful tests.

## VM

- 2 CPU cores, 4 GB RAM (6 GB recommended)
- 30 GB virtual disk
- EFI or BIOS mode
- Take a snapshot before testing
- Test GNOME Wayland; record GNOME Shell version

## Before boot

Download ISO from GitHub Actions and verify the provided checksum:

```bash
sha256sum -c MAC-OS-amd64.iso.sha256
```

## Checklist

- [ ] ISO boots in BIOS and/or UEFI
- [ ] Live GNOME session opens; network works
- [ ] MAC wallpaper and dark appearance defaults are applied
- [ ] Plymouth splash is visible (custom theme may need initramfs integration)
- [ ] MAC extension is installed and auto-enabled; if not, enable manually
- [ ] `⌘ MAC` panel menu is visible
- [ ] Panel menu opens and its options work
- [ ] Dock appears centered on primary monitor, near bottom
- [ ] Files, Web, Text Editor, Settings, Terminal icons show
- [ ] Dock favorites launch the expected apps
- [ ] Running favorites display indicators
- [ ] App-grid button opens launcher
- [ ] Launcher search filters apps and shows empty state
- [ ] Up/Down/Enter/Escape keyboard behavior works
- [ ] Launcher rows click to launch and dismiss
- [ ] Dock repositioning reacts to monitor changes
- [ ] Extension disable removes MAC panel/dock/launcher cleanly
- [ ] Re-enable works
- [ ] No shell errors in journal
- [ ] Logout/login behaves normally

## Diagnostics

```bash
gnome-shell --version
gnome-extensions list
gnome-extensions info mac-shell@macos-project
dconf read /org/gnome/shell/enabled-extensions
journalctl --user -b | grep -i -E 'gnome-shell|mac-shell'
```

## Rollback

```bash
gnome-extensions disable mac-shell@macos-project
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Keep GNOME's stock panel/compositor intact during this prototype stage. Do not install to real hardware; no installer, partition safeguards, or recovery tooling exists yet.