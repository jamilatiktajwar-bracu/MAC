#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root (example: sudo bash ./scripts/build-iso.sh)." >&2
  exit 1
fi
if ! command -v lb >/dev/null 2>&1; then
  echo "live-build is missing. Install it with: apt install live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools syslinux-utils" >&2
  exit 1
fi
if ! command -v isohybrid >/dev/null 2>&1; then
  echo "isohybrid is missing. Install syslinux-utils before building the hybrid ISO." >&2
  exit 1
fi

# Install a build-only chroot hook so dconf defaults and Plymouth theme are
# compiled into the image and initramfs after our include files are in place.
HOOK_DIR="$ROOT/config/hooks/live"
HOOK="$HOOK_DIR/0100-mac-branding.hook.chroot"
mkdir -p "$HOOK_DIR"
cat > "$HOOK" <<'MAC_CHROOT_HOOK'
#!/bin/sh
set -eu
if command -v glib-compile-schemas >/dev/null 2>&1; then
  glib-compile-schemas --strict /usr/share/gnome-shell/extensions/mac-shell@macos-project/schemas
fi
if command -v dconf >/dev/null 2>&1; then
  dconf update
fi
if command -v plymouth-set-default-theme >/dev/null 2>&1; then
  plymouth-set-default-theme mac
fi
if command -v update-initramfs >/dev/null 2>&1; then
  update-initramfs -u
fi
MAC_CHROOT_HOOK
chmod +x "$HOOK"
cleanup_hook() {
  rm -f "$HOOK"
  rmdir "$HOOK_DIR" 2>/dev/null || true
}
trap cleanup_hook EXIT

lb config \
  --mode debian \
  --distribution trixie \
  --mirror-bootstrap "https://deb.debian.org/debian" \
  --mirror-chroot "https://deb.debian.org/debian" \
  --mirror-binary "https://deb.debian.org/debian" \
  --architectures amd64 \
  --archive-areas "main contrib non-free non-free-firmware" \
  --security false \
  --initsystem systemd \
  --binary-images iso-hybrid \
  --bootloader grub2 \
  --debian-installer false \
  --linux-flavours amd64 \
  --linux-packages none \
  --bootappend-live "boot=live components quiet splash" \
  --apt-recommends true

lb build

ISO="$ROOT/MAC-OS-amd64.iso"
if [[ -f "$ROOT/binary.hybrid.iso" ]]; then
  cp "$ROOT/binary.hybrid.iso" "$ISO"
elif [[ -f "$ROOT/live-image-amd64.hybrid.iso" ]]; then
  cp "$ROOT/live-image-amd64.hybrid.iso" "$ISO"
else
  echo "Build finished, but expected ISO filename was not found. See build output." >&2
  find "$ROOT" -maxdepth 1 -name "*.iso" -print
  exit 1
fi
sha256sum "$ISO" | tee "$ISO.sha256"

# Inspect the image boot catalog so malformed ISO output fails the build.
xorriso -indev "$ISO" -report_el_torito

MANIFEST="$ROOT/MAC-OS-build-manifest.txt"
{
  echo "Product: MAC OS Live Prototype"
  echo "Build date (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Architecture: amd64"
  echo "Base: Debian 13 (Trixie)"
  if command -v git >/dev/null 2>&1 && git rev-parse --short HEAD >/dev/null 2>&1; then
    echo "Source commit: $(git rev-parse HEAD)"
    echo "Source revision: $(git rev-parse --short HEAD)"
  else
    echo "Source commit: unknown (source archive)"
  fi
  echo "ISO file: $(basename "$ISO")"
  echo "ISO size (bytes): $(stat -c %s "$ISO")"
  echo "SHA-256: $(sha256sum "$ISO" | awk '{print $1}')"
} | tee "$MANIFEST"

echo "ISO created: $ISO"
