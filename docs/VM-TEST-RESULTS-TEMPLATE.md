# MAC OS — VM test result record

Use one copy of this template per ISO build. Do not mark a test as Pass without a visible result or attached log/screenshot.

## Build identity

| Field | Value |
|---|---|
| ISO filename | |
| SHA-256 | |
| Git commit | |
| Build Actions run | |
| Test date (UTC) | |
| Host OS / version | |
| QEMU version | |
| VirtualBox version | |
| GNOME Shell version (guest) | |

## Firmware and live boot

| Hypervisor | Firmware | Result (Pass / Fail / Not tested) | Evidence / notes |
|---|---|---|---|
| QEMU | BIOS | Not tested | |
| QEMU | UEFI / OVMF | Not tested | |
| VirtualBox | BIOS | Not tested | |
| VirtualBox | UEFI / EFI | Not tested | |

A successful El Torito catalog check confirms that boot entries exist in the image. It does not prove that firmware can boot the image or reach the desktop.

## Desktop and device checks

| Check | Result (Pass / Fail / Not tested / Not supported) | Evidence / notes |
|---|---|---|
| Live GNOME session reaches desktop | Not tested | |
| MAC wallpaper and appearance defaults | Not tested | |
| MAC panel menu and shortcuts | Not tested | |
| Dock layout, app launch, running indicators | Not tested | |
| Dock auto-hide and persistence | Not tested | |
| Favorites add/remove/save/reload | Not tested | |
| Favorites drag-and-drop reorder | Not tested | |
| Favorites keyboard Up/Down reorder | Not tested | |
| Launcher search and keyboard navigation | Not tested | |
| Files, Web, Settings, Terminal, Text Editor | Not tested | |
| Audio output | Not tested | |
| Microphone input | Not tested | |
| NetworkManager / virtual Ethernet | Not tested | |
| Physical Wi-Fi chipset | Not tested | |
| Display resize / fullscreen / resolution | Not tested | |
| Suspend / resume | Not tested | |
| Keyboard-only accessibility / screen reader | Not tested | |
| GNOME Shell and system logs clean | Not tested | |

A virtual Ethernet NIC does not validate physical Wi-Fi compatibility. Record unsupported hypervisor features as Not supported rather than Pass.

## Evidence to attach

- Screenshot of the live desktop after boot, with hypervisor and firmware mode identified.
- Output of `sha256sum -c MAC-OS-amd64.iso.sha256`.
- `gnome-shell --version` and `gnome-extensions info mac-shell@macos-project`.
- `nmcli device status`, `wpctl status`, and relevant warning/error excerpts from `journalctl`.
- For failures, include the exact steps, VM settings, and the smallest useful log excerpt.

## Release decision

- [ ] BIOS boot verified
- [ ] UEFI boot verified
- [ ] At least one complete live desktop session verified
- [ ] Audio, network, display, accessibility and suspend results reviewed
- [ ] Known limitations and failed tests documented

Do not announce a bootable release while any required firmware boot or live-session test remains unverified.
