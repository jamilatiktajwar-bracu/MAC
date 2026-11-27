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
if [[ ! "$EXPECTED" =~ ^[[:xdigit:]]{64}$ ]]; then
  echo "Checksum file does not begin with a valid SHA-256 digest: $CHECKSUM" >&2
  exit 1
fi
ACTUAL="$(sha256sum "$ISO" | awk '{print $1}')"
if [[ "$EXPECTED" != "$ACTUAL" ]]; then
  echo "SHA-256 mismatch for $ISO" >&2
  echo "Expected: $EXPECTED" >&2
  echo "Actual:   $ACTUAL" >&2
  exit 1
fi

BOOT_REPORT="$(xorriso -indev "$ISO" -report_el_torito 2>&1)"
printf '%s\n' "$BOOT_REPORT"
if ! grep -Eiq 'El Torito boot img :[[:space:]]*[0-9]+[[:space:]]+BIOS([[:space:]]|$)' <<<"$BOOT_REPORT"; then
  echo "El Torito BIOS boot entry (platform 0x00) was not found." >&2
  exit 1
fi
if ! grep -Eiq 'El Torito boot img :[[:space:]]*[0-9]+[[:space:]]+UEFI([[:space:]]|$)' <<<"$BOOT_REPORT"; then
  echo "El Torito UEFI boot entry (platform 0xEF) was not found." >&2
  exit 1
fi

printf 'Verified ISO: %s\nSHA-256: %s\nSize: %s bytes\nBIOS El Torito entry: present\nUEFI El Torito entry: present\n' "$ISO" "$ACTUAL" "$(stat -c %s "$ISO")"
