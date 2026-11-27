# MAC OS Roadmap

## Phase 0 — Project foundation
- [x] Initialize project documentation
- [x] Choose initial base distribution (Debian Stable) and desktop stack (GNOME/Wayland extension prototype); hardware target still open
- [ ] Define name, logo, visual design system, and license
- [ ] Establish development/testing workflow

## Phase 1 — Bootable foundation
- [x] Create initial live-build configuration and CI ISO build workflow (build/boot validation pending)
- [ ] Build a reproducible Linux-based image
- [ ] Boot in QEMU/VirtualBox
- [ ] Configure user, networking, audio, display, and updates
- [ ] Produce and verify a first bootable ISO

## Phase 2 — Desktop experience
- [ ] Top menu/status panel
- [ ] Dock with app launchers and running indicators
- [ ] Desktop and window management
- [ ] App overview and search
- [ ] Dark/light theme, wallpaper, icons, animations
- [ ] Keyboard shortcuts and accessibility

## Phase 3 — System applications
- [ ] Settings
- [ ] File manager
- [ ] Terminal
- [ ] Software center/package manager UI
- [ ] System monitor

## Phase 4 — Installer and release
- [ ] Installer and disk partition flow
- [ ] Live USB workflow
- [ ] Hardware compatibility testing
- [ ] Update/recovery strategy
- [ ] Release notes and documentation

## Phase 5 — Original differentiators
- [ ] Optional integrated AI assistant
- [ ] Unified search
- [ ] Privacy/security controls
- [ ] Original app ecosystem and APIs

## Architecture decision (initial recommendation)
Use an established Linux kernel and base distribution for the first usable release. Build the custom desktop shell and OS experience on top. A custom kernel can be explored later if there is a clear technical need.

## Prototype milestones
- [x] v0.1 — basic desktop UI
- [x] v0.2 — boot/lock flow and quick panels
- [x] v0.3 — launcher search and quick-panel dismissal polish
- [x] v0.4 — local Notes autosave, persistent dark mode preference, clickable folder demo, simulated terminal commands
- [x] v0.5 — Debian Stable + GNOME/Wayland architecture decision and reversible extension scaffold
- [x] v0.5.1 — experimental panel menu, text dock, searchable launcher scaffold (VM testing pending)
- [x] v0.5.2 — icon dock, running-app dots, launcher keyboard navigation (VM validation pending)
- [ ] v0.6 — run CI build successfully, boot ISO in VM, and validate shell
