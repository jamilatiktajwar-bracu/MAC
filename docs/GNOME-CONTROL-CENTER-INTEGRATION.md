# MAC Desktop Settings and GNOME Control Center integration

## Current implementation

MAC provides a native libadwaita preferences window through the GNOME Shell Extensions preferences API. It is installed as the `MAC Desktop Settings` application, appears in the Settings application category, and is reachable from the MAC panel menu. It edits the MAC extension's GSettings keys for Dock auto-hide, magnification, and favorites. Favorites support installed-app selection, removal, drag-and-drop ordering, and keyboard Up/Down ordering.

This is a native GTK4/libadwaita settings window, but it is **not** a panel embedded inside GNOME Control Center.

## Why an embedded panel is a separate engineering project

The target image uses Debian 13 (Trixie) GNOME Control Center 48.4. Its panel loader uses a compiled-in panel registry (`PANEL_TYPE(...)` entries in `cc-panel-loader.c`) rather than discovering third-party panel modules from a stable extension directory. The exposed `cc_panel_loader_override_vtable()` is documented in the source as a test mechanism to replace the panel table, not as a third-party plugin API.

A genuinely embedded MAC page therefore requires maintaining a GNOME Control Center source patch (or carrying a downstream build) that registers a MAC `CcPanel`, compiles it against the matching GNOME Control Center/GTK/libadwaita ABI, and ships the patched application. This creates version-coupling and upgrade-maintenance costs that a Shell extension alone cannot avoid.

## Chosen staged approach

1. Keep the stock GNOME Control Center intact and reversible.
2. Keep MAC Desktop Settings as a native libadwaita window with its own desktop launcher and Shell-menu entry.
3. Validate the preferences UI and its GTK4 drag-and-drop behavior in the live image before making deeper Control Center changes.
4. Only build an embedded `CcPanel` after the base ISO and desktop are stable; pin the exact GNOME Control Center source version and maintain an explicit patch/build test.

## Validation boundary

Static JavaScript/schema/package checks do not prove the preferences window opens or that drag-and-drop works in a real Shell session. Complete the relevant checks in [the VM checklist](SHELL-VM-TEST.md) and record evidence in [the VM result template](VM-TEST-RESULTS-TEMPLATE.md).

## References

- Debian Trixie currently packages GNOME Control Center 48.4: https://packages.debian.org/trixie/gnome-control-center
- GNOME Control Center 48.4 panel loader source: https://sources.debian.org/src/gnome-control-center/1%3A48.4-1~deb13u1/shell/cc-panel-loader.c
- GNOME Control Center panel header/source: https://sources.debian.org/src/gnome-control-center/1%3A48.4-1~deb13u1/shell/cc-panel.h
