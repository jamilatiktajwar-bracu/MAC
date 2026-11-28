#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_SCRIPT="$ROOT/scripts/build-iso.sh"
PACKAGE_LIST="$ROOT/config/package-lists/mac-desktop.list.chroot"

if grep -Fq -- '--linux-packages none' "$BUILD_SCRIPT"; then
  echo "live-build kernel installation must not be disabled." >&2
  exit 1
fi
grep -Fq -- '--linux-packages linux-image' "$BUILD_SCRIPT"
grep -Fqx 'linux-image-amd64' "$PACKAGE_LIST"
grep -Fq 'binary/live/vmlinuz' "$BUILD_SCRIPT"
grep -Fq 'binary/live/initrd.img' "$BUILD_SCRIPT"

echo "ISO build config keeps the Linux kernel package and checks live boot files."
