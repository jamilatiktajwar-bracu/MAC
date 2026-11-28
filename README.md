# MAC OS

A macOS-inspired desktop project with original branding and implementation, initially based on Debian/Linux.

> This is not Apple's macOS and contains no proprietary Apple code or assets.

## Current status

Browser prototype v0.7-dev, experimental GNOME Shell v0.8-dev features, and a Debian live-ISO build pipeline. The image build and shell must still pass CI and VM testing before we can claim a working bootable release.

## Browser prototype

Open `index.html` in a modern browser or run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. The web demo includes boot/lock flow, menu bar, control center, notifications, desktop icons, launcher, dock, draggable demo windows, Settings, Notes, Files, Browser, Terminal, and About. Dock magnification preference persists across reloads; window close/minimize/maximize shortcuts are available. Controls are simulated; they do not control real hardware. Window shortcuts: `Ctrl/⌘+W` closes the front window, `Ctrl/⌘+M` minimizes it, and `Ctrl/⌘+Alt+F` toggles maximize. Dock magnification can be enabled in Settings and is remembered locally. Reduced-motion preferences are respected for dock animation.

## Native experiment

The initial native target is Debian 13 (Trixie) + GNOME/Wayland. MAC is currently an extension layered on GNOME—not a new kernel, compositor, or standalone OS. The native launcher adapts to smaller displays and monitor changes, with keyboard focus indicators. Native MAC Desktop Settings now exposes dock auto-hide, magnification, and editable favorites with drag-and-drop plus keyboard reordering; the panel menu also provides Home and Downloads shortcuts. The live image explicitly packages the libadwaita runtime required by the preferences UI.

- [Visual design system](docs/DESIGN-SYSTEM.md)
- [Architecture](docs/ARCHITECTURE.md)
- [GNOME Control Center integration strategy](docs/GNOME-CONTROL-CENTER-INTEGRATION.md)
- [Shell features and testing](shell/README.md)
- [QEMU BIOS/UEFI launcher](scripts/run-vm.sh)
- [ISO build guide](docs/BOOTABLE-ISO.md)
- [VM test checklist](docs/SHELL-VM-TEST.md)
- [Roadmap](docs/ROADMAP.md)

## Development principles

1. Establish a bootable Linux base.
2. Build a distinctive, maintainable shell and design system.
3. Prioritize accessibility, privacy, security, and performance.
4. Validate changes in disposable VMs before wider testing.

License remains to be chosen.