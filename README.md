# MAC OS

A personal, macOS-inspired operating system project. This project aims to build a polished desktop experience with its own identity, based on an open-source Linux foundation initially.

> macOS-inspired design, original branding and implementation. This is not Apple's macOS and does not include Apple's proprietary code or assets.

## Current status

**Desktop prototype v0.1** is available as a browser-based mockup. It is not a bootable operating system yet.

## Preview the desktop prototype

Open `index.html` directly in a modern browser, or run a local server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

### Prototype features
- macOS-inspired menu bar and clock
- Desktop wallpaper concept and desktop shortcuts
- Dock with hover effect and application launcher/search
- Draggable application windows, minimize, maximize, close
- Settings demo with toggles
- Files, Browser, Terminal, Notes and About app mockups

## Direction

- **Foundation:** Linux-based distribution (recommended for a practical, bootable first release)
- **Desktop experience:** custom shell inspired by macOS conventions: top panel, dock, overview, window management
- **Identity:** original MAC OS branding, icons, wallpapers, themes
- **Core apps:** file manager, settings, terminal, browser, software center
- **Delivery:** bootable ISO, live environment, installer

## Roadmap

See [ROADMAP.md](docs/ROADMAP.md).

## Development principles

1. Start with a working bootable Linux base.
2. Make the desktop shell and design system distinctive and maintainable.
3. Prioritize accessibility, security, performance, and hardware compatibility.
4. Keep changes in feature branches and test before merging.

## License

License to be selected before publishing or distributing code.
