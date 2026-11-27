# Bootable ISO build (experimental)

This creates a Debian Stable live image with GNOME and the experimental MAC GNOME Shell extension installed. It is a Linux-based prototype, not a new kernel or independent distribution yet.

## Local build (Debian/Ubuntu)

Install build dependencies:

```bash
sudo apt update
sudo apt install live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools
```

From the repository root:

```bash
sudo bash ./scripts/build-iso.sh
```

The script produces `MAC-OS-amd64.iso`, a SHA-256 checksum file (`MAC-OS-amd64.iso.sha256`), and a build manifest (`MAC-OS-build-manifest.txt`) with the UTC build timestamp, source commit (when available), image size, and hash. It needs network access and several GB of disk space. Build output is not guaranteed to be identical byte-for-byte across runs because the Debian Stable package repositories change.

## GitHub Actions build

Open the repository's Actions tab and run **Build MAC OS Live ISO** manually. The workflow also starts on relevant changes to the build config, script, shell extension, or workflow itself. On success, download the `MAC-OS-live-amd64` artifact from the run. It contains the ISO, checksum, and build manifest. The workflow summary also displays the build metadata. Artifacts expire after 7 days.

## Included environment

- Debian Stable, amd64
- GNOME desktop core and GNOME Shell
- GNOME Files, Terminal, Settings, Text Editor
- NetworkManager
- live-boot / live-config
- MAC Shell extension files installed system-wide (disabled by default for safer first boot)

## First-boot testing

Boot the ISO in a disposable VirtualBox or QEMU VM:
- 2 CPUs, 4 GB RAM minimum (6 GB recommended)
- 30 GB virtual disk (live session does not require installation)
- EFI enabled or BIOS mode
- Snapshot before changes

After reaching GNOME, inspect extension state:

```bash
gnome-extensions list
gnome-extensions info mac-shell@macos-project
```

Enable it manually for testing:

```bash
gnome-extensions enable mac-shell@macos-project
```

Log out and back in if GNOME requests it. On Wayland, do not restart GNOME Shell with Alt+F2, R.

See [shell VM validation checklist](SHELL-VM-TEST.md). This milestone builds an ISO; boot and extension compatibility must still be tested and documented separately.

## Troubleshooting

- If build fails, inspect the complete live-build log in the workflow or local terminal output.
- For missing ISO output, check files created by live-build in the repository root.
- Ensure enough disk space and stable internet.
- Do not install this image to real hardware until the installer, partitioning, data-loss safeguards, and recovery process exist.
