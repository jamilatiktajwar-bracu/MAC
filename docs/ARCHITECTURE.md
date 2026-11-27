# MAC OS v0.5 — Linux Desktop Architecture

## Decision

For the first native desktop prototype, target **Debian Stable + GNOME Shell (Wayland)** and implement MAC's desktop layer as a GNOME Shell extension.

Why:
- Debian provides a stable, well-documented Linux base and package management.
- GNOME Shell already provides a compositor/window manager, workspace management, accessibility, and system integration.
- A Shell extension lets us prototype a branded panel, launcher, dock, and desktop UI without replacing the compositor or writing a window manager.
- This is a stepping stone. A standalone shell or compositor may be evaluated only after the extension prototype proves the design.

## Architecture

```
Debian Stable
├── Linux kernel + drivers
├── systemd / system services
├── GNOME / Wayland session
│   ├── Mutter (compositor + window management)
│   ├── GNOME Shell (session UI)
│   └── MAC Shell Extension (our UI layer)
│       ├── MAC top panel / branding
│       ├── app launcher / overview entry
│       ├── dock prototype
│       └── quick settings / status UI (prototype)
└── Native applications (Files, Terminal, Settings, etc.)
```

## Initial developer setup

Use a disposable Debian VM with GNOME installed. Keep a snapshot before modifying the desktop.

Install the extension into the current user's extension directory:
`~/.local/share/gnome-shell/extensions/mac-shell@macos-project/`

Copy the starter extension from this repository, then log out/in (or restart the GNOME session in a safe VM). Enable it with GNOME Extensions or:
`gnome-extensions enable mac-shell@macos-project`

For a Wayland session, do not use Alt+F2 then `r` to restart Shell; log out and back in instead.

## Scope and limitations

- v0.5 is an architecture decision and extension scaffold, not an operating system or ISO.
- Do not disable the stock GNOME panel until a replacement has been implemented and tested.
- Avoid modifying system files. Extension changes should be reversible by disabling/uninstalling the extension.
- Test on a VM first; do not experiment on the user's main machine.
- Later milestones: launcher search, dock/running indicators, settings integration, theme, packaging, reproducible live image.

## Milestones

- [x] Architecture decision documented
- [x] Extension starter scaffold committed
- [ ] Debian GNOME VM test
- [ ] Implement custom panel and branding
- [ ] Implement dock/launcher prototype
- [ ] Evaluate live image build
