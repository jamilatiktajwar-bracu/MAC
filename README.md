# MAC OS

A personal, macOS-inspired operating system project. This project aims to build a polished desktop experience with its own identity, based on an open-source Linux foundation initially.

> macOS-inspired design, original branding and implementation. This is not Apple's macOS and does not include Apple's proprietary code or assets.

## Current status

**Browser prototype v0.4** plus experimental native-shell v0.5.2 (icon dock, launcher keyboard controls, and running-app dots) and an initial Debian live-ISO build pipeline. The ISO build and GNOME extension still require VM testing.

## Preview the desktop prototype

Open `index.html` directly in a modern browser, or run a local server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

### Prototype features
- Animated boot screen and interactive lock screen
- Menu bar with live clock
- Control Center mockup: connectivity toggles, appearance, brightness and volume sliders
- Notification panel with clear action
- Desktop wallpaper, shortcuts and welcome card
- Dock with hover animation and application launcher/search
- Draggable app windows with minimize, maximize and close
- Settings mockup, Notes, Files, Browser, Terminal and About apps
- Launcher empty state and quick-panel dismissal
- Notes local autosave, persistent dark appearance preference, folder interaction demo, simulated terminal commands

**Note:** Apps and system controls are demonstrations; they do not control real hardware or provide actual web browsing.

## Native shell experiment

The first native prototype targets **Debian Stable + GNOME Shell (Wayland)**. The MAC desktop layer is currently a reversible GNOME Shell extension scaffold that adds a `⌘ MAC` panel menu, a simple bottom dock, and a searchable installed-app launcher overlay. It does not replace GNOME's panel, compositor, or window manager.

- [Architecture decision](docs/ARCHITECTURE.md)
- [Shell scaffold instructions](shell/README.md)
- [Bootable ISO build instructions](docs/BOOTABLE-ISO.md)
- [Disposable VM validation plan](docs/SHELL-VM-TEST.md)

Compatibility and behavior must be tested in a disposable VM before claiming support.

## Roadmap

See [ROADMAP.md](docs/ROADMAP.md).

## Development principles
1. Start with a working bootable Linux base.
2. Make the desktop shell and design system distinctive and maintainable.
3. Prioritize accessibility, security, performance, and hardware compatibility.
4. Keep changes in feature branches and test before merging.

## License

License to be selected before publishing or distributing code.
