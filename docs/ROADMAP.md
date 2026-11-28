# MAC OS Roadmap

## Phase 0 — Project foundation
- [x] Initialize documentation
- [x] Choose Debian 13 (Trixie) + GNOME/Wayland as first base
- [ ] Set name, logo, visual design system, and license
- [x] Establish initial repository and CI workflow

## Phase 1 — Bootable foundation
- [x] Configure Debian 13 (Trixie) live-build and CI ISO workflow
- [x] Configure explicit trixie-security APT sources for both build and live session; verify exact suite and apt signatures in CI
- [x] Use Debian Trixie's live-build `trixie-updates` source during package resolution
- [x] Package GNOME desktop, network manager, and core apps
- [x] Add build checksum and source manifest
- [x] Add source consistency checks to CI
- [x] Add standalone ISO checksum and El Torito boot-catalog verifier
- [x] Add GNOME System Monitor, Calculator, Disk Utility, and extension preferences
- [x] Add MAC dconf defaults, wallpaper, and boot-theme assets
- [x] Add generated build hook for dconf compilation and Plymouth initramfs update
- [ ] Complete successful CI ISO build
- [ ] Verify ISO checksum and boot catalog
- [x] Add QEMU BIOS/UEFI launch helper and VM test matrix
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
- [x] Native launcher adapts to smaller displays and monitor changes
- [x] Native dock and launcher keyboard-focus styling
- [ ] Theme, icon, animation, and full accessibility pass
- [x] Browser prototype window shortcuts (close, minimize, maximize)
- [x] Persistent Dock magnification preference in browser prototype
- [x] Native shell launcher shortcut and keyboard navigation/focus styling
- [x] Browser prototype Dock magnification control
- [x] Native dock magnification preference and panel-menu toggle
- [x] Native Dock auto-hide and editable favorites in MAC Desktop Settings
- [x] Native Settings favorites picker with installed-app list and accessible move-up/move-down ordering
- [x] Native Dock drag-reorder with accessible arrow-button fallback

## Phase 3 — System applications
- [x] Include Files, Web, Terminal, Settings, and Text Editor
- [x] Native MAC Desktop Settings preferences (libadwaita)
- [ ] Full GNOME Control Center branding/integration
- [x] Native dock magnification preference
- [x] Native dock auto-hide and favorites controls
- [x] Favorites picker supports installed-app selection and accessible move-up/move-down ordering
- [x] Native dock drag-reorder with accessible arrow-button fallback
- [ ] Software center/package-manager UX
- [x] Include GNOME System Monitor in the native image
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
- [x] v0.7-dev — browser window shortcuts and persistent Dock preferences; responsive native launcher, keyboard-focus styling, and GSettings-backed native Dock magnification
- [ ] v0.7 — usability, accessibility, and native-shell integration validation
- [x] v0.8-dev — native MAC Desktop Settings, dock auto-hide/favorites, Files shortcuts, and QEMU firmware test tooling
- [ ] v0.8 — successful ISO build plus BIOS/UEFI VM boot and desktop validation
