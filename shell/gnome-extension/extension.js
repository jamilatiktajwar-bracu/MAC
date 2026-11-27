import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const FAVORITES = [
  ['Files', 'org.gnome.Nautilus.desktop'],
  ['Settings', 'org.gnome.Settings.desktop'],
  ['Terminal', 'org.gnome.Terminal.desktop'],
  ['Text Editor', 'org.gnome.TextEditor.desktop'],
];

export default class MacShellExtension extends Extension {
  enable() {
    this._buildPanelMenu();
    this._buildDock();
  }

  _buildPanelMenu() {
    this._button = new PanelMenu.Button(0.0, 'MAC Shell');
    this._button.add_style_class_name('mac-shell-indicator');
    this._button.add_child(new St.Label({
      text: '⌘ MAC',
      y_align: St.Align.CENTER,
    }));

    const overviewItem = new PopupMenu.PopupMenuItem('Show Overview');
    overviewItem.connect('activate', () => Main.overview.toggle());
    this._button.menu.addMenuItem(overviewItem);

    const launcherItem = new PopupMenu.PopupMenuItem('App Launcher');
    launcherItem.connect('activate', () => this._toggleLauncher());
    this._button.menu.addMenuItem(launcherItem);

    this._button.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this._addAppItem('Open Settings', 'org.gnome.Settings.desktop');
    this._addAppItem('Open Terminal', 'org.gnome.Terminal.desktop');
    Main.panel.addToStatusArea(this.uuid, this._button, 0, 'left');
  }

  _buildDock() {
    this._dock = new St.BoxLayout({ style_class: 'mac-dock', reactive: true });
    for (const [label, desktopId] of FAVORITES) {
      const app = Gio.DesktopAppInfo.new(desktopId);
      const button = new St.Button({
        style_class: 'mac-dock-item',
        can_focus: true,
        reactive: true,
        track_hover: true,
        child: new St.Label({ text: app?.get_name() ?? label }),
      });
      button.connect('clicked', () => this._launch(desktopId));
      this._dock.add_child(button);
    }
    Main.layoutManager.addChrome(this._dock, {
      trackFullscreen: false,
      affectsStruts: false,
    });
    this._dock.set_position(0, 0);
    this._dock.set_anchor_point(0, 0);
    this._dock.set_x(Math.floor((global.stage.width - this._dock.width) / 2));
    this._dock.set_y(global.stage.height - 70);
    this._dock.set_width(Math.min(global.stage.width - 32, 520));
    this._dock.connect('notify::allocation', () => this._positionDock());
    this._positionDock();
  }

  _positionDock() {
    if (!this._dock) return;
    const width = Math.min(global.stage.width - 32, 520);
    this._dock.set_width(width);
    this._dock.set_x(Math.floor((global.stage.width - width) / 2));
    this._dock.set_y(global.stage.height - 76);
  }

  _toggleLauncher() {
    if (this._launcher) {
      this._launcher.destroy();
      this._launcher = null;
      return;
    }

    this._launcher = new St.BoxLayout({
      vertical: true,
      style_class: 'mac-launcher',
      width: 420,
    });
    this._launcherEntry = new St.Entry({
      style_class: 'mac-launcher-search',
      hint_text: 'Search applications…',
      can_focus: true,
    });
    this._launcher.add_child(this._launcherEntry);
    this._launcherList = new St.BoxLayout({ vertical: true });
    this._launcher.add_child(this._launcherList);
    Main.layoutManager.addChrome(this._launcher, { affectsStruts: false });
    this._launcher.set_position(
      Math.floor((global.stage.width - 420) / 2),
      Math.floor((global.stage.height - 380) / 2)
    );
    this._populateLauncher('');
    this._launcherEntry.clutter_text.connect('text-changed', () => {
      this._populateLauncher(this._launcherEntry.get_text());
    });
    this._launcherEntry.grab_key_focus();
  }

  _populateLauncher(query) {
    if (!this._launcherList) return;
    this._launcherList.destroy_all_children();
    const apps = Gio.AppInfo.get_all()
      .filter(app => app.should_show())
      .sort((a, b) => a.get_name().localeCompare(b.get_name()));
    const matches = apps.filter(app =>
      app.get_name().toLowerCase().includes(query.toLowerCase())
    ).slice(0, 12);

    if (!matches.length) {
      this._launcherList.add_child(new St.Label({
        text: 'No applications found',
        style_class: 'mac-launcher-empty',
      }));
      return;
    }

    for (const app of matches) {
      const row = new St.Button({
        style_class: 'mac-launcher-row',
        can_focus: true,
        child: new St.Label({ text: app.get_name(), x_align: Clutter.ActorAlign.START }),
      });
      row.connect('clicked', () => {
        app.launch([], null);
        this._closeLauncher();
      });
      this._launcherList.add_child(row);
    }
  }

  _closeLauncher() {
    this._launcher?.destroy();
    this._launcher = null;
    this._launcherEntry = null;
    this._launcherList = null;
  }

  _addAppItem(label, desktopId) {
    const item = new PopupMenu.PopupMenuItem(label);
    item.connect('activate', () => this._launch(desktopId));
    this._button.menu.addMenuItem(item);
  }

  _launch(desktopId) {
    const app = Gio.DesktopAppInfo.new(desktopId);
    if (app) app.launch([], null);
    else Main.notify('MAC Shell', `Application not installed: ${desktopId}`);
  }

  disable() {
    this._closeLauncher();
    if (this._dock) {
      Main.layoutManager.removeChrome(this._dock);
      this._dock.destroy();
      this._dock = null;
    }
    this._button?.destroy();
    this._button = null;
  }
}
