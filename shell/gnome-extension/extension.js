import St from 'gi://St';
import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export default class MacShellExtension extends Extension {
  enable() {
    this._button = new PanelMenu.Button(0.0, 'MAC Shell');
    this._button.add_child(new St.Label({
      text: '⌘ MAC',
      y_align: St.Align.CENTER,
    }));

    const overviewItem = new PopupMenu.PopupMenuItem('Show Overview');
    overviewItem.connect('activate', () => Main.overview.toggle());
    this._button.menu.addMenuItem(overviewItem);

    this._button.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    this._addAppItem('Open Settings', 'org.gnome.Settings.desktop');
    this._addAppItem('Open Terminal', 'org.gnome.Terminal.desktop');

    Main.panel.addToStatusArea(this.uuid, this._button, 0, 'left');
  }

  _addAppItem(label, desktopId) {
    const item = new PopupMenu.PopupMenuItem(label);
    item.connect('activate', () => {
      const app = Gio.DesktopAppInfo.new(desktopId);
      if (app)
        app.launch([], null);
      else
        Main.notify('MAC Shell', `Could not find app: ${desktopId}`);
    });
    this._button.menu.addMenuItem(item);
  }

  disable() {
    this._button?.destroy();
    this._button = null;
  }
}
