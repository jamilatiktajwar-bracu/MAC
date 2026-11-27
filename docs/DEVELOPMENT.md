# MAC OS Development Guide

## Current milestone: v0.8-dev — native desktop settings and boot validation

The repository has a browser UI prototype, an experimental GNOME extension, and a live-build configuration with GitHub Actions automation for a Debian 13 (Trixie) GNOME live ISO. Native MAC Desktop Settings, dock auto-hide, favorites, and Files shortcuts are implemented; ISO build and VM boot remain unverified. The ISO build and VM boot remain unverified.

### Browser prototype
- From the repository root, run `python3 -m http.server 8000`.
- Visit `http://localhost:8000`.
- Stop the server with Ctrl+C.

### Browser smoke-test checklist
- [ ] Boot splash transitions to lock screen.
- [ ] Enter Desktop button dismisses lock screen.
- [ ] Clock updates.
- [ ] Dock icons and desktop shortcuts open their apps.
- [ ] Launcher opens, search filters apps, and no-match state appears.
- [ ] Ctrl+Space (or Cmd+Space) toggles launcher.
- [ ] Escape closes launcher and quick panels.
- [ ] Control Center toggles; tiles respond; brightness changes desktop brightness.
- [ ] Clock opens notifications and Clear removes the card.
- [ ] Windows can be dragged, minimized, maximized, restored and closed.
- [ ] Notes text saves to local browser storage and survives refresh.
- [ ] Terminal demo commands: help, clear, about, date, time, pwd, ls, echo, whoami.

### ISO build
See [Bootable ISO build guide](BOOTABLE-ISO.md). Trigger the GitHub Actions workflow manually to build and download the ISO artifact.

### Native extension test

The native preferences use libadwaita. The image package list explicitly includes `gir1.2-adw-1` and `libadwaita-1-0`. Run `bash scripts/validate-native.sh` to check JavaScript syntax, strict GSettings schema compilation, desktop launcher metadata, and equality between source and packaged extension files.

See [Shell VM test plan](SHELL-VM-TEST.md). Only test in a disposable Debian GNOME VM; the extension is experimental and not yet validated against a real GNOME Shell session.

### Milestones
- v0.1: basic desktop UI.
- v0.2: boot/lock flow and quick panels.
- v0.3: launcher search empty state and quick-panel dismissal behavior.
- v0.4: Notes persistence, persistent dark appearance preference, clickable folder mockups, simulated terminal commands.
- v0.5: Debian Stable + GNOME/Wayland architecture documented; extension scaffold added.
- v0.5.1: panel menu, dock shortcuts, searchable launcher scaffold.
- v0.5.2: icon dock, running-app indicators, keyboard navigation.
- v0.6: live ISO build pipeline added; CI build and VM testing pending.
