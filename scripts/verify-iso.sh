#!/usr/bin/env bash
set -euo pipefail

ISO="${1:-MAC-OS-amd64.iso}"
CHECKSUM="${ISO}.sha256"

if [[ ! -s "$ISO" ]]; then
  echo "ISO missing or empty: $ISO" >&2
  exit 1
fi
if [[ ! -s "$CHECKSUM" ]]; then
  echo "Checksum file missing: $CHECKSUM" >&2
  exit 1
fi
if ! command -v sha256sum >/dev/null 2>&1; then
  echo "sha256sum is required." >&2
  exit 1
fi
if ! command -v xorriso >/dev/null 2>&1; then
  echo "xorriso is required to inspect the boot catalog." >&2
  exit 1
fi

EXPECTED="$(awk 'NR==1 {print $1}' "$CHECKSUM")"
ACTUAL="$(sha256sum "$ISO" | awk '{print $1}')"
if [[ -z "$EXPECTED" || "$EXPECTED" != "$ACTUAL" ]]; then
  echo "SHA-256 mismatch for $ISO" >&2
  echo "Expected: $EXPECTED" >&2
  echo "Actual:   $ACTUAL" >&2
  exit 1
fi

xorriso -indev "$ISO" -report_el_torito
printf 'Verified ISO: %s\nSHA-256: %s\nSize: %s bytes\n' "$ISO" "$ACTUAL" "$(stat -c %s "$ISO")"
