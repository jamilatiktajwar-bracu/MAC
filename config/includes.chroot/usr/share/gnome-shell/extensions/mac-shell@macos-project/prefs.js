import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
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
    window.default_width = 640;
    window.default_height = 620;

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

    const favoritesGroup = new Adw.PreferencesGroup({
      title: 'Favorite applications',
      description: 'Add, remove, and drag rows to change the Dock order.',
    });

    const availableApps = Gio.AppInfo.get_all()
      .filter(app => app.should_show() && app.get_id())
      .map(app => ({ id: app.get_id(), name: app.get_name() }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const appNames = availableApps.map(app => app.name);
    const appModel = Gtk.StringList.new(appNames);

    const pickerRow = new Adw.ActionRow({ title: 'Add an application' });
    const appPicker = new Gtk.DropDown({
      model: appModel,
      hexpand: true,
      valign: Gtk.Align.CENTER,
    });
    const addButton = new Gtk.Button({
      label: 'Add',
      valign: Gtk.Align.CENTER,
    });
    addButton.add_css_class('suggested-action');
    pickerRow.add_suffix(appPicker);
    pickerRow.add_suffix(addButton);
    favoritesGroup.add(pickerRow);

    const favoritesList = new Gtk.ListBox({
      selection_mode: Gtk.SelectionMode.NONE,
      show_separators: true,
    });
    favoritesList.add_css_class('boxed-list');

    const addFavoriteRow = desktopId => {
      if (!desktopId || favoritesList.get_children().some(row => row._macDesktopId === desktopId))
        return;
      const app = Gio.DesktopAppInfo.new(desktopId);
      const row = new Gtk.ListBoxRow({ reorderable: true });
      row._macDesktopId = desktopId;
      const content = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 12,
        margin_top: 6,
        margin_bottom: 6,
        margin_start: 12,
        margin_end: 6,
      });
      const label = new Gtk.Label({
        label: app?.get_name() ?? desktopId,
        xalign: 0,
        hexpand: true,
      });
      label.set_tooltip_text(desktopId);
      const removeButton = new Gtk.Button({
        icon_name: 'list-remove-symbolic',
        tooltip_text: 'Remove from Dock favorites',
        valign: Gtk.Align.CENTER,
      });
      removeButton.add_css_class('flat');
      removeButton.connect('clicked', () => favoritesList.remove(row));
      content.append(label);
      content.append(removeButton);
      row.set_child(content);
      favoritesList.append(row);
    };

    const loadFavorites = ids => {
      favoritesList.remove_all();
      ids.forEach(addFavoriteRow);
    };

    loadFavorites(settings.get_strv('dock-favorites'));

    addButton.connect('clicked', () => {
      const selected = appPicker.selected;
      if (selected !== Gtk.INVALID_LIST_POSITION && availableApps[selected])
        addFavoriteRow(availableApps[selected].id);
    });

    const listRow = new Adw.ActionRow({ title: 'Dock order' });
    listRow.set_child(favoritesList);
    favoritesGroup.add(listRow);

    const saveRow = new Adw.ActionRow({
      title: 'Save Dock favorites',
      subtitle: 'The Dock updates immediately after saving.',
    });
    const saveButton = new Gtk.Button({
      label: 'Save',
      valign: Gtk.Align.CENTER,
    });
    saveButton.add_css_class('suggested-action');
    saveButton.connect('clicked', () => {
      const ids = favoritesList.get_children().map(row => row._macDesktopId);
      settings.set_strv('dock-favorites', ids);
      saveButton.label = 'Saved';
    });
    saveRow.add_suffix(saveButton);
    favoritesGroup.add(saveRow);

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
      loadFavorites(DEFAULT_FAVORITES);
      settings.set_strv('dock-favorites', DEFAULT_FAVORITES);
      saveButton.label = 'Saved';
    });
    resetRow.add_suffix(resetButton);
    helpGroup.add(resetRow);

    page.add(dockGroup);
    page.add(favoritesGroup);
    page.add(helpGroup);
    window.add(page);
  }
}
