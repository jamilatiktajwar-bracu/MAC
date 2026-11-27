# MAC OS Roadmap

## Phase 0 — Project foundation
- [x] Initialize documentation
- [x] Choose Debian Stable + GNOME/Wayland as first base
- [ ] Set name, logo, visual design system, and license
- [x] Establish initial repository and CI workflow

## Phase 1 — Bootable foundation
- [x] Configure Debian live-build and CI ISO workflow
- [x] Package GNOME desktop, network manager, and core apps
- [x] Add build checksum and source manifest
- [x] Add source consistency checks to CI
- [x] Add MAC dconf defaults, wallpaper, and boot-theme assets
- [x] Add generated build hook for dconf compilation and Plymouth initramfs update
- [ ] Complete successful CI ISO build
- [ ] Verify ISO checksum and boot catalog
- [ ] Boot in QEMU/VirtualBox (BIOS and UEFI)
- [ ] Verify networking, audio, display, and live-session stability

## Phase 2 — Desktop experience
- [x] MAC top-panel menu
- [x] Dock with app shortcuts and running indicators
- [x] App overview/search launcher with keyboard controls and Super+K hotkey
- [x] Dock placement follows primary-monitor changes
- [x] Original wallpaper and dark appearance defaults
- [ ] Validate menu, dock, launcher, and GNOME integration in VM
- [ ] Window management polish and desktop behavior
- [ ] Theme, icon, animation, and accessibility pass
- [ ] Keyboard shortcuts and focus navigation
- [ ] Dock auto-hide, favorite customization, and drag-reorder

## Phase 3 — System applications
- [x] Include Files, Web, Terminal, Settings, and Text Editor
- [ ] Custom Settings experience
- [ ] Software center/package-manager UX
- [ ] System monitor
- [ ] First-party Notes app (native, not web demo)

## Phase 4 — Installer and release
- [ ] Installer and disk partition flow
- [ ] Live USB instructions and validation
- [ ] Hardware compatibility testing
- [ ] Updates, recovery, and rollback strategy
- [ ] Release notes, checksums, and supported-hardware list

## Phase 5 — Original differentiators
- [ ] Optional integrated assistant
- [ ] Unified search
- [ ] Privacy/security controls
- [ ] Original application APIs and ecosystem

## Architecture decision
Use an established Linux kernel and distribution for the first usable release. Build the shell and design language above it. A custom kernel is a later exploration only if there is a technical need.

## Prototype milestones
- [x] v0.1 — basic browser desktop
- [x] v0.2 — boot/lock flow and quick panels
- [x] v0.3 — launcher and quick-panel polish
- [x] v0.4 — Notes autosave, dark mode persistence, simulated file/terminal behavior
- [x] v0.5 — Debian/GNOME architecture and reversible extension
- [x] v0.5.1 — MAC menu, dock and launcher scaffold
- [x] v0.5.2 — icon dock, running indicators and keyboard controls
- [x] v0.6-dev — branding assets, live-session defaults, native dock polish and CI source checks
- [ ] v0.6 — successful ISO build and VM smoke test
