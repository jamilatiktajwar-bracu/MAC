#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root (example: sudo bash ./scripts/build-iso.sh)." >&2
  exit 1
fi
if ! command -v lb >/dev/null 2>&1; then
  echo "live-build is missing. Install it with: apt install live-build debootstrap xorriso squashfs-tools grub-pc-bin grub-efi-amd64-bin mtools" >&2
  exit 1
fi

lb config \
  --distribution stable \
  --architectures amd64 \
  --archive-areas "main contrib non-free non-free-firmware" \
  --binary-images iso-hybrid \
  --bootloaders "grub-efi,grub-pc" \
  --debian-installer false \
  --linux-flavours amd64 \
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

MANIFEST="$ROOT/MAC-OS-build-manifest.txt"
{
  echo "Product: MAC OS Live Prototype"
  echo "Build date (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Architecture: amd64"
  echo "Base: Debian Stable"
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
