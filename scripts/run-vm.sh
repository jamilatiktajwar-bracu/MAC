#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISO="${1:-$ROOT/MAC-OS-amd64.iso}"
FIRMWARE="${2:-bios}"

if [[ ! -f "$ISO" ]]; then
  echo "ISO not found: $ISO" >&2
  echo "Usage: $0 [path/to/MAC-OS-amd64.iso] [bios|uefi]" >&2
  exit 1
fi
if ! command -v qemu-system-x86_64 >/dev/null 2>&1; then
  echo "Install QEMU: sudo apt install qemu-system-x86" >&2
  exit 1
fi

ARGS=(-m 4096 -smp 2 -cdrom "$ISO" -boot d -vga virtio -nic user,model=virtio-net-pci)
case "$FIRMWARE" in
  bios)
    echo "Starting MAC OS live ISO with legacy BIOS firmware."
    exec qemu-system-x86_64 "${ARGS[@]}"
    ;;
  uefi)
    CODE=""
    VARS=""
    for candidate in /usr/share/OVMF/OVMF_CODE_4M.fd /usr/share/OVMF/OVMF_CODE.fd; do
      if [[ -f "$candidate" ]]; then CODE="$candidate"; break; fi
    done
    for candidate in /usr/share/OVMF/OVMF_VARS_4M.fd /usr/share/OVMF/OVMF_VARS.fd; do
      if [[ -f "$candidate" ]]; then VARS="$candidate"; break; fi
    done
    if [[ -z "$CODE" || -z "$VARS" ]]; then
      echo "OVMF firmware missing. Install it with: sudo apt install ovmf" >&2
      exit 1
    fi
    VARS_COPY="$(mktemp "${TMPDIR:-/tmp}/mac-ovmf-vars.XXXXXX.fd")"
    cp "$VARS" "$VARS_COPY"
    trap 'rm -f "$VARS_COPY"' EXIT
    echo "Starting MAC OS live ISO with UEFI (OVMF) firmware."
    qemu-system-x86_64 "${ARGS[@]}" \
      -drive if=pflash,format=raw,readonly=on,file="$CODE" \
      -drive if=pflash,format=raw,file="$VARS_COPY"
    ;;
  *)
    echo "Unknown firmware '$FIRMWARE'; use bios or uefi." >&2
    exit 2
    ;;
esac
