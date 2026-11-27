# MAC OS — Disposable VM validation

## Goal

Boot the live ISO and test the MAC wallpaper/defaults, GNOME extension, top-panel menu, dock, app launcher, and safe disable/rollback. This checklist is not a report of successful tests.

## VM

Use the same ISO for two separate virtual machines: one configured for legacy BIOS and one configured for UEFI/EFI. Do not treat a successful checksum as proof that either firmware mode boots.

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
- [ ] MAC Desktop Settings opens from the application grid and panel menu
- [ ] Dock auto-hide reveals on pointer approach and hides away from the bottom edge
- [ ] Dock auto-hide setting persists after logout/login
- [ ] Favorite application IDs can be edited and saved in MAC Desktop Settings
- [ ] Updated favorites appear in the Dock without restarting GNOME Shell
- [ ] Restore default favorites works
- [ ] MAC menu opens Home and Downloads in Files
- [ ] Running favorites display indicators
- [ ] App-grid button opens launcher
- [ ] Launcher search filters apps and shows empty state
- [ ] Up/Down/Home/End/Enter/Escape keyboard behavior works
- [ ] Dock and launcher can be reached and activated using keyboard only
- [ ] Screen reader announces meaningful names for dock controls
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
## Native MAC preferences and Dock checks

The live image includes libadwaita runtime packages for the MAC Desktop Settings preferences. Open it from the MAC panel menu or the application grid. Configure auto-hide and favorites, save, and confirm the Dock updates immediately. Confirm settings persist after logout/login.

## QEMU firmware tests

Install QEMU and (for UEFI) OVMF:

```bash
sudo apt install qemu-system-x86 ovmf
bash scripts/run-vm.sh MAC-OS-amd64.iso bios
bash scripts/run-vm.sh MAC-OS-amd64.iso uefi
```

For each firmware mode, confirm the VM reaches the live GNOME login/desktop, then complete the checklist above. The launcher script uses 4 GB RAM, 2 virtual CPUs, a virtio display/network adapter, and boots from the ISO. Close the QEMU window to stop the VM.

## VirtualBox firmware tests

Create two disposable Linux VMs using the same ISO:
- BIOS VM: System → Motherboard → disable EFI.
- UEFI VM: System → Motherboard → enable EFI.
- Assign at least 4 GB RAM and 2 CPUs; attach the ISO as an optical disk.
- Start each VM independently and record whether the live desktop appears.
- Do not install to the virtual hard disk; this milestone tests live boot only.

Record the host OS, QEMU/VirtualBox version, firmware mode, ISO SHA-256, boot result, and any shell errors for each run.
