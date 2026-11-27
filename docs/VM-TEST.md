# MAC Shell — VM Test Checklist

This is a manual validation guide. The extension has not yet been tested on an actual GNOME session.

## 1. Create a safe test VM

- Use VirtualBox, QEMU, or another hypervisor.
- Install Debian Stable with a GNOME desktop.
- Use a non-production VM and create a snapshot after first boot.
- Log in using a GNOME Wayland session.

## 2. Install the extension

From a clone of this repository:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
cp -r shell/gnome-extension/* ~/.local/share/gnome-shell/extensions/mac-shell@macos-project/
```

Check extension metadata:

```bash
gnome-extensions info mac-shell@macos-project
```

Enable:

```bash
gnome-extensions enable mac-shell@macos-project
```

If it doesn't load immediately, log out and back in (Wayland).

## 3. Manual test checklist

- [ ] Extension appears in GNOME Extensions.
- [ ] Top panel shows the `⌘ MAC` indicator.
- [ ] Clicking indicator toggles Overview.
- [ ] No Shell errors are visible in journal logs.
- [ ] Disabling extension removes the indicator cleanly.
- [ ] Re-enabling restores it.

Inspect logs:

```bash
journalctl --user -f
```

## 4. Rollback

Disable the extension:

```bash
gnome-extensions disable mac-shell@macos-project
```

Remove the installed extension:

```bash
rm -r ~/.local/share/gnome-shell/extensions/mac-shell@macos-project
```

Then log out/in. Keep GNOME's standard desktop components enabled throughout this milestone.

## Results

Record the Debian release, GNOME Shell version, session type (Wayland/X11), test outcomes, and any log errors in the project issue or development notes before marking this scaffold as validated.
