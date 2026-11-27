#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXT="$ROOT/shell/gnome-extension"
PACKAGED="$ROOT/config/includes.chroot/usr/share/gnome-shell/extensions/mac-shell@macos-project"
SCHEMA="$EXT/schemas/org.gnome.shell.extensions.mac-shell.gschema.xml"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

node --input-type=module --check < "$EXT/extension.js"
node --input-type=module --check < "$EXT/prefs.js"
bash -n "$ROOT/scripts/run-vm.sh"
python3 -m json.tool "$EXT/metadata.json" >/dev/null
python3 -c 'import configparser,sys; p=configparser.ConfigParser(interpolation=None); p.read(sys.argv[1]); s=p["Desktop Entry"]; assert s.get("Name") == "MAC Desktop Settings"; assert s.get("Exec") == "gnome-extensions prefs mac-shell@macos-project"' "$ROOT/config/includes.chroot/usr/share/applications/mac-desktop-settings.desktop"
python3 -c 'import xml.etree.ElementTree as ET,sys; ET.parse(sys.argv[1]); ET.parse(sys.argv[2])' "$SCHEMA" "$ROOT/config/includes.chroot/usr/share/icons/hicolor/scalable/apps/mac-desktop-settings.svg"

mkdir -p "$TMP/schemas"
cp "$SCHEMA" "$TMP/schemas/"
glib-compile-schemas --strict "$TMP/schemas"

cmp "$EXT/extension.js" "$PACKAGED/extension.js"
cmp "$EXT/prefs.js" "$PACKAGED/prefs.js"
cmp "$EXT/stylesheet.css" "$PACKAGED/stylesheet.css"
cmp "$EXT/metadata.json" "$PACKAGED/metadata.json"
cmp "$SCHEMA" "$PACKAGED/schemas/org.gnome.shell.extensions.mac-shell.gschema.xml"

echo "Native MAC extension, preferences, schema, launcher and packaged copies validated."
