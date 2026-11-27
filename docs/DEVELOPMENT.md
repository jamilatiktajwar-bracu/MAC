# MAC OS Development Guide

## Current milestone: v0.4 — core app functionality and persistence

This repository currently contains a browser-based desktop UI prototype, not a Linux distribution or bootable ISO.

### Run locally
- Use a modern desktop browser.
- From the repository root, run `python3 -m http.server 8000`.
- Visit `http://localhost:8000`.
- Stop the server with Ctrl+C.

### Manual smoke-test checklist
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

### Planned technical direction
The first bootable target should use a stable Linux base (Debian is the initial recommendation), with the custom MAC shell layered on top. Do not advertise an ISO until a reproducible build recipe has been created and tested.

## Milestones
- v0.1: basic desktop UI.
- v0.2: boot/lock flow and quick panels.
- v0.3: launcher search empty state and quick-panel dismissal behavior.\n- v0.4: Notes persistence, persistent dark appearance preference, clickable folder mockups, simulated terminal commands.
- v0.4: core-app functionality and local persistence.
- v0.5: Debian Stable + GNOME/Wayland architecture documented; experimental GNOME Shell extension scaffold added. VM validation is still pending.
- v0.6: reproducible bootable image build.
