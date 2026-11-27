# MAC OS

A macOS-inspired desktop project with original branding and implementation, initially based on Debian/Linux.

> This is not Apple's macOS and contains no proprietary Apple code or assets.

## Current status

Browser prototype v0.4, experimental GNOME Shell v0.6 features, and a Debian live-ISO build pipeline. The image build and shell must still pass CI and VM testing before we can claim a working bootable release.

## Browser prototype

Open `index.html` in a modern browser or run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. The web demo includes boot/lock flow, menu bar, control center, notifications, desktop icons, launcher, dock, draggable demo windows, Settings, Notes, Files, Browser, Terminal, and About. Controls are simulated; they do not control real hardware.

## Native experiment

The initial native target is Debian Stable + GNOME/Wayland. MAC is currently an extension layered on GNOME—not a new kernel, compositor, or standalone OS.

- [Architecture](docs/ARCHITECTURE.md)
- [Shell features and testing](shell/README.md)
- [ISO build guide](docs/BOOTABLE-ISO.md)
- [VM test checklist](docs/SHELL-VM-TEST.md)
- [Roadmap](docs/ROADMAP.md)

## Development principles

1. Establish a bootable Linux base.
2. Build a distinctive, maintainable shell and design system.
3. Prioritize accessibility, privacy, security, and performance.
4. Validate changes in disposable VMs before wider testing.

License remains to be chosen.