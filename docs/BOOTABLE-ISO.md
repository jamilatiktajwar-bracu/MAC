# Bootable ISO build (experimental)

The build script runs with Debian 13 (Trixie) `live-build` from the matching Debian environment and uses Debian Trixie mirrors (not the Ubuntu host's default apt mirror). It explicitly enables live-build's `linux-image` kernel packaging stage (flavour `amd64`); the desktop package list also contains `linux-image-amd64`. Do not set `--linux-packages none`: that disables live-build's kernel-install stage and leaves the bootloader stage without `binary/live/vmlinuz`. After building, the script checks that both `binary/live/vmlinuz` and `binary/live/initrd.img` exist before continuing. It pins the official `trixie-security` suite explicitly through `config/archives/mac-security.list.chroot` and `config/archives/mac-security.list.binary`. The `.chroot` file supplies the security repository during image construction; the matching `.binary` file configures APT in the live session. `--security false` disables live-build's automatically generated security entry so the explicit current suite name is used instead. Trixie's `trixie-updates` index is supplied by live-build's normal Trixie configuration (the CI build log has fetched that suite). APT signature verification is explicitly enabled with `--apt-secure true`. CI checks the exact security repository line and confirms the build/live entries match. Rebuild from current Trixie package metadata before testing or distributing an image. This produces a Debian 13 (Trixie) live image with GNOME, MAC desktop defaults, a custom wallpaper, a minimal Plymouth theme, and the experimental MAC GNOME Shell extension. It is a Linux-based prototype, not a new kernel or independent distribution.

## Local build (Debian 13 Trixie)

Use a Debian 13 (Trixie) host or disposable container. The selected `live-build` package must support `--bootloaders` so Syslinux BIOS and GRUB EFI can be included together. The build intentionally uses the matching Trixie host tools (`--build-with-chroot false`) for the binary stage.

```bash
sudo apt update
sudo apt install ca-certificates git live-build debootstrap debian-archive-keyring xorriso genisoimage squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools syslinux-utils isolinux dctrl-tools nodejs python3 libglib2.0-bin
sudo bash ./scripts/build-iso.sh
```

The build produces `MAC-OS-amd64.iso`, a checksum file, and `MAC-OS-build-manifest.txt`. It uses a hybrid ISO with Syslinux/ISOLINUX for legacy BIOS and GRUB EFI for UEFI, so the same image is intended for optical media and USB block-device boot. The host build tools run inside a Debian Trixie container matching the target distribution. The workflow independently re-checks the SHA-256 and El Torito boot catalog with `scripts/verify-iso.sh` before uploading the artifact (UTC timestamp, source commit, architecture, size, SHA-256). It requires network access and several GB of free space. Builds are not guaranteed byte-for-byte reproducible because Debian packages move.

## GitHub Actions

The **Build MAC OS Live ISO** workflow triggers on relevant source changes and can be started manually from Actions. It builds inside a privileged Debian Trixie container so that the live-build version and bootloader tooling match the target distribution, then verifies the output on the Ubuntu runner. On success, download the `MAC-OS-live-amd64` artifact containing the ISO, checksum, and manifest. Artifacts expire after 7 days; the workflow summary includes metadata.

## Included environment

- Debian 13 (Trixie) amd64 with GNOME Shell, session, GDM
- Files, Epiphany Web, Terminal, Settings, Text Editor
- GNOME Extension Preferences, System Monitor, Calculator, Disk Utility
- NetworkManager
- Official Debian `trixie-security` APT source configured explicitly for build and live session; Debian Trixie `trixie-updates` is provided by live-build; APT signature verification is enabled
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
- The hybrid ISO requires Syslinux/ISOLINUX to be the first BIOS bootloader so the `isohybrid` utility can add the hybrid MBR/GPT structures; GRUB EFI is included as the UEFI boot entry. Do not configure GRUB PC as the first loader for this Syslinux hybrid workflow.
- If live-build reports missing `binary/live/vmlinuz`, check that `--linux-packages linux-image` is enabled (not `none`) and that the kernel package is included; the build now explicitly checks for both kernel and initramfs files.
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
