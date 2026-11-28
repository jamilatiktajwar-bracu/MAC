# Bootable ISO build (experimental)

The build script runs with Debian 13 (Trixie) `live-build` from the matching Debian environment, uses Debian mirrors (not the Ubuntu host's default apt mirror), and adds the current `trixie-security` repository separately. This avoids live-build's obsolete `stable/updates` security-suite naming. This produces a Debian 13 (Trixie) live image with GNOME, MAC desktop defaults, a custom wallpaper, a minimal Plymouth theme, and the experimental MAC GNOME Shell extension. It is a Linux-based prototype, not a new kernel or independent distribution.

## Local build (Debian 13 Trixie)

Use a Debian 13 (Trixie) host or disposable container. The selected `live-build` package must support the `--bootloaders` option so GRUB BIOS and GRUB EFI can be included together.

```bash
sudo apt update
sudo apt install live-build debootstrap debian-archive-keyring xorriso genisoimage squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools
sudo bash ./scripts/build-iso.sh
```

The build produces `MAC-OS-amd64.iso`, a checksum file, and `MAC-OS-build-manifest.txt`. It uses an ISO 9660 optical-media image with separate GRUB PC (legacy BIOS) and GRUB EFI (UEFI) boot entries. It is not a USB-hybrid image yet; USB-hybrid output is a separate milestone. The workflow independently re-checks the SHA-256 and El Torito boot catalog with `scripts/verify-iso.sh` before uploading the artifact (UTC timestamp, source commit, architecture, size, SHA-256). It requires network access and several GB of free space. Builds are not guaranteed byte-for-byte reproducible because Debian packages move.

## GitHub Actions

The **Build MAC OS Live ISO** workflow triggers on relevant source changes and can be started manually from Actions. It builds inside a privileged Debian Trixie container so that the live-build version and bootloader tooling match the target distribution, then verifies the output on the Ubuntu runner. On success, download the `MAC-OS-live-amd64` artifact containing the ISO, checksum, and manifest. Artifacts expire after 7 days; the workflow summary includes metadata.

## Included environment

- Debian 13 (Trixie) amd64 with GNOME Shell, session, GDM
- Files, Epiphany Web, Terminal, Settings, Text Editor
- GNOME Extension Preferences, System Monitor, Calculator, Disk Utility
- NetworkManager
- live-boot / live-config
- Inter and emoji fonts, Papirus icons, Plymouth
- MAC GNOME Shell extension, configured to auto-enable through system dconf defaults
- MAC dark appearance and custom SVG wallpaper defaults
- MAC Plymouth theme selected and initramfs regeneration attempted by a temporary build hook (must verify on boot)

## First boot in a VM

Recommended disposable VM:
- 2 CPUs, 4 GB RAM minimum (6 GB recommended)
- 30 GB disk (the live session itself does not require installation)
- EFI or BIOS; test both when possible
- Take a snapshot before any installation experiments

Verify extension and dconf:

```bash
gnome-extensions list
gnome-extensions info mac-shell@macos-project
dconf read /org/gnome/shell/enabled-extensions
```

If the shell extension did not auto-load:

```bash
gnome-extensions enable mac-shell@macos-project
```

See the [VM checklist](SHELL-VM-TEST.md) and [VM test result template](VM-TEST-RESULTS-TEMPLATE.md). Build, boot, splash theme, wallpaper, and shell behavior remain unverified until the corresponding tests are run and recorded.

## Troubleshooting and safety

- Review full live-build and GitHub Actions logs.
- The ISO build intentionally avoids Syslinux `isohybrid`: that tool requires an ISOLINUX hybrid signature and cannot post-process this GRUB2 ISO. Do not switch back to `iso-hybrid` unless the project changes to a supported hybrid bootloader layout.
- Check the root directory for the ISO outputs if the expected file name is absent.
- Make sure network and disk space are sufficient.
- Inspect shell errors with `journalctl --user -b | grep -i -E 'gnome-shell|mac-shell'`.
- Do not install on real hardware yet: the project has no installer, disk-partition flow, backup safeguard, or recovery plan.

## Verify a downloaded ISO

Install `xorriso` if needed, place the ISO and its matching `.sha256` file in the same directory, then run:

```bash
sudo apt install xorriso
bash ./scripts/verify-iso.sh MAC-OS-amd64.iso
```

A successful check confirms the checksum and reports the ISO boot catalog. It does not replace an actual BIOS/UEFI VM boot test.
