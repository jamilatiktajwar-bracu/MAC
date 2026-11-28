#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root inside a Debian 13 (Trixie) build environment." >&2
  exit 1
fi
if ! command -v lb >/dev/null 2>&1; then
  echo "live-build is missing. Install the Debian 13 live-build package and its GRUB/ISO build dependencies." >&2
  exit 1
fi
if [[ ! -r /usr/lib/ISOLINUX/isolinux.bin ]]; then
  echo "ISOLINUX BIOS boot image is missing. Install the Debian isolinux package on the build host." >&2
  exit 1
fi
if ! lb config --help 2>&1 | grep -q -- '--bootloaders'; then
  echo "This build requires Debian Trixie live-build with the --bootloaders option (Syslinux BIOS + GRUB EFI)." >&2
  exit 1
fi

# Pin the official Debian Trixie security and stable-updates suites explicitly.
# Keep live-build's automatic security source disabled; these archives are
# consumed by the chroot build and written into the live system via .list.binary.
SECURITY_SOURCE="deb https://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware"
for suffix in chroot binary; do
  for spec in "mac-security|$SECURITY_SOURCE"; do
    file="${spec%%|*}"
    expected="${spec#*|}"
    path="$ROOT/config/archives/$file.list.$suffix"
    if [[ ! -f "$path" ]] || ! grep -Fqx "$expected" "$path"; then
      echo "Missing or incorrect Debian archive configuration: $path" >&2
      exit 1
    fi
  done
done

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

# Clear only generated live-build settings so changed bootloader/image options
# are not shadowed by values saved from a previous local build.
if [[ -f .build/config ]]; then
  lb clean --purge
fi
rm -f config/all config/common config/bootstrap config/chroot config/binary config/source

lb config \
  --mode debian \
  --distribution trixie \
  --mirror-bootstrap "https://deb.debian.org/debian" \
  --mirror-chroot "https://deb.debian.org/debian" \
  --mirror-binary "https://deb.debian.org/debian" \
  --architecture amd64 \
  --archive-areas "main contrib non-free non-free-firmware" \
  --security false \
  --apt-secure true \
  --initsystem systemd \
  --binary-image iso-hybrid \
  --bootloaders "syslinux grub-efi" \
  --build-with-chroot false \
  --debian-installer false \
  --linux-flavours amd64 \
  --linux-packages none \
  --bootappend-live "boot=live components quiet splash" \
  --apt-recommends true

lb build

# Validate the APT sources inside the actual live root filesystem, not only
# the source files in the repository. This catches missing .binary archives.
LIVE_ROOTFS="$ROOT/binary/live/filesystem.squashfs"
if [[ ! -s "$LIVE_ROOTFS" ]]; then
  echo "Live root filesystem image is missing: $LIVE_ROOTFS" >&2
  exit 1
fi
LIVE_SECURITY_SOURCE="$(unsquashfs -cat "$LIVE_ROOTFS" etc/apt/sources.list.d/mac-security.list)"
if ! grep -Fqx "$SECURITY_SOURCE" <<<"$LIVE_SECURITY_SOURCE"; then
  echo "The live image does not contain the expected Debian trixie-security source." >&2
  exit 1
fi
LIVE_MAIN_SOURCES="$(unsquashfs -cat "$LIVE_ROOTFS" etc/apt/sources.list)"
if ! grep -Fq 'trixie-updates' <<<"$LIVE_MAIN_SOURCES"; then
  echo "The live image does not contain the Debian trixie-updates source." >&2
  exit 1
fi
echo "Verified Debian security and updates APT sources inside live root filesystem."

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
  echo "Live-build: $(lb --version | head -n 1)"
  echo "Bootloaders: Syslinux/ISOLINUX (BIOS) + GRUB EFI (UEFI)"
  echo "Image format: ISO hybrid (optical media + USB block-device boot)"
  echo "Build tools: Debian Trixie host container (--build-with-chroot false; matched target distribution)"
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
