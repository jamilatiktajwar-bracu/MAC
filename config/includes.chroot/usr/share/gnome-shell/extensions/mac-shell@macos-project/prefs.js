import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const DEFAULT_FAVORITES = [
  'org.gnome.Nautilus.desktop',
  'org.gnome.Epiphany.desktop',
  'org.gnome.TextEditor.desktop',
  'org.gnome.Settings.desktop',
  'org.gnome.Terminal.desktop',
];

export default class MacShellPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();
    window.default_width = 620;
    window.default_height = 520;

    const page = new Adw.PreferencesPage({
      title: 'MAC Desktop',
      icon_name: 'preferences-desktop',
    });

    const dockGroup = new Adw.PreferencesGroup({
      title: 'Dock',
      description: 'Customize the MAC desktop dock.',
    });

    const autoHide = new Adw.SwitchRow({
      title: 'Automatically hide Dock',
      subtitle: 'Reveal the Dock when the pointer approaches the bottom edge.',
      active: settings.get_boolean('dock-auto-hide'),
    });
    autoHide.connect('notify::active', () => {
      settings.set_boolean('dock-auto-hide', autoHide.active);
    });
    dockGroup.add(autoHide);

    const magnification = new Adw.SwitchRow({
      title: 'Dock icon magnification',
      subtitle: 'Enlarge icons while the pointer hovers over them.',
      active: settings.get_boolean('dock-magnification'),
    });
    magnification.connect('notify::active', () => {
      settings.set_boolean('dock-magnification', magnification.active);
    });
    dockGroup.add(magnification);

    const favoritesRow = new Adw.ActionRow({
      title: 'Favorite applications',
      subtitle: 'Comma-separated desktop IDs, in display order.',
    });
    const favoritesEntry = new Gtk.Entry({
      hexpand: true,
      valign: Gtk.Align.CENTER,
      text: settings.get_strv('dock-favorites').join(', '),
      placeholder_text: DEFAULT_FAVORITES.join(', '),
    });
    const saveButton = new Gtk.Button({
      label: 'Save',
      valign: Gtk.Align.CENTER,
    });
    saveButton.add_css_class('suggested-action');
    saveButton.connect('clicked', () => {
      const ids = favoritesEntry.text.split(',')
        .map(value => value.trim())
        .filter(value => value.length > 0);
      settings.set_strv('dock-favorites', ids);
      saveButton.label = 'Saved';
    });
    favoritesEntry.connect('changed', () => {
      saveButton.label = 'Save';
    });
    favoritesRow.add_suffix(favoritesEntry);
    favoritesRow.add_suffix(saveButton);
    dockGroup.add(favoritesRow);

    const helpGroup = new Adw.PreferencesGroup({
      title: 'MAC OS',
      description: 'A Debian GNU/Linux desktop prototype using GNOME technologies.',
    });
    const resetRow = new Adw.ActionRow({
      title: 'Restore default favorites',
      subtitle: 'Return the Dock to Files, Web, Text Editor, Settings and Terminal.',
    });
    const resetButton = new Gtk.Button({
      label: 'Restore',
      valign: Gtk.Align.CENTER,
    });
    resetButton.connect('clicked', () => {
      settings.set_strv('dock-favorites', DEFAULT_FAVORITES);
      favoritesEntry.text = DEFAULT_FAVORITES.join(', ');
      saveButton.label = 'Saved';
    });
    resetRow.add_suffix(resetButton);
    helpGroup.add(resetRow);

    page.add(dockGroup);
    page.add(helpGroup);
    window.add(page);
  }
}
