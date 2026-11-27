#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERIFY="$ROOT/scripts/verify-iso.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/bin"

cat > "$TMP/bin/xorriso" <<'MOCK_XORRISO'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' 'El Torito catalog  : 42  1'
if [[ "${MOCK_BIOS:-yes}" == yes ]]; then
  printf '%s\n' 'El Torito boot img : 1  BIOS  y  none  0x0000  0x00  4  1234'
fi
if [[ "${MOCK_UEFI:-yes}" == yes ]]; then
  printf '%s\n' 'El Torito boot img : 2  UEFI  y  none  0x0000  0x00  4  5678'
fi
MOCK_XORRISO
chmod +x "$TMP/bin/xorriso"

ISO="$TMP/test.iso"
printf 'MAC test ISO payload\n' > "$ISO"
sha256sum "$ISO" > "$ISO.sha256"

PATH="$TMP/bin:$PATH" bash "$VERIFY" "$ISO" >/dev/null

printf '0000000000000000000000000000000000000000000000000000000000000000  %s\n' "$ISO" > "$ISO.sha256"
if PATH="$TMP/bin:$PATH" bash "$VERIFY" "$ISO" >/dev/null 2>&1; then
  echo "Verifier accepted an incorrect checksum." >&2
  exit 1
fi

sha256sum "$ISO" > "$ISO.sha256"
if MOCK_BIOS=no PATH="$TMP/bin:$PATH" bash "$VERIFY" "$ISO" >/dev/null 2>&1; then
  echo "Verifier accepted an ISO without a BIOS boot entry." >&2
  exit 1
fi

sha256sum "$ISO" > "$ISO.sha256"
if MOCK_UEFI=no PATH="$TMP/bin:$PATH" bash "$VERIFY" "$ISO" >/dev/null 2>&1; then
  echo "Verifier accepted an ISO without a UEFI boot entry." >&2
  exit 1
fi

echo "ISO verifier tests passed (valid image, checksum mismatch, missing BIOS entry, missing UEFI entry)."
