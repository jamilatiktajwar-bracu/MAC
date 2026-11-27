# MAC OS

A personal, macOS-inspired operating system project. This project aims to build a polished desktop experience with its own identity, based on an open-source Linux foundation initially.

> macOS-inspired design, original branding and implementation. This is not Apple's macOS and does not include Apple's proprietary code or assets.

## Current status

**Desktop prototype v0.4** is available as a browser-based mockup. It is not a bootable operating system yet.

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
- Launcher shows a friendly empty state when a search has no matches
- Escape key closes launcher and open quick panels

**Note:** Apps and system controls are demonstrations; they do not control real hardware or provide actual web browsing.

## Direction

- **Foundation:** Linux-based distribution (recommended for a practical, bootable first release)
- **Desktop experience:** custom shell inspired by macOS conventions: top panel, dock, overview, window management
- **Identity:** original MAC OS branding, icons, wallpapers, themes
- **Core apps:** file manager, settings, terminal, browser, software center
- **Delivery:** bootable ISO, live environment, installer

## Roadmap

See [ROADMAP.md](docs/ROADMAP.md).\n\nNative desktop architecture and GNOME Shell experiment: [Architecture](docs/ARCHITECTURE.md) · [Shell scaffold](shell/README.md).\n\n**v0.5 architecture decision:** Debian Stable + GNOME/Wayland, prototyping the MAC desktop layer as a reversible GNOME Shell extension. The native scaffold is experimental and has not been VM-tested yet.

## Development principles

1. Start with a working bootable Linux base.
2. Make the desktop shell and design system distinctive and maintainable.
3. Prioritize accessibility, security, performance, and hardware compatibility.
4. Keep changes in feature branches and test before merging.

## License

License to be selected before publishing or distributing code.
