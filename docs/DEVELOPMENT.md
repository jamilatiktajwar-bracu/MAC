# MAC OS Development Guide

## Current milestone: v0.5 — native shell architecture and validation

The repository contains a browser-based UI prototype and an experimental GNOME Shell extension scaffold. It is not a bootable operating system or ISO.

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

### Native extension test
See [Shell VM test plan](SHELL-VM-TEST.md). Only test in a disposable Debian GNOME VM; the extension is experimental and not yet validated against a real GNOME Shell session.

### Milestones
- v0.1: basic desktop UI.
- v0.2: boot/lock flow and quick panels.
- v0.3: launcher search empty state and quick-panel dismissal behavior.
- v0.4: Notes persistence, persistent dark appearance preference, clickable folder mockups, simulated terminal commands.
- v0.5: Debian Stable + GNOME/Wayland architecture documented; extension scaffold added. VM validation is pending.
- v0.6: reproducible bootable image build.
