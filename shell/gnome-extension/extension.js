import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const FAVORITES = [
  ['Files', 'org.gnome.Nautilus.desktop'],
  ['Web', 'org.gnome.Epiphany.desktop'],
  ['Text Editor', 'org.gnome.TextEditor.desktop'],
  ['Settings', 'org.gnome.Settings.desktop'],
  ['Terminal', 'org.gnome.Terminal.desktop'],
];

export default class MacShellExtension extends Extension {
  enable() {
    this._buildPanelMenu();
    this._buildDock();
    this._monitorSignal = Main.layoutManager.connect('monitors-changed', () => this._positionDock());
    this._runningAppsTimer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3, () => {
      this._refreshRunningIndicators();
      return GLib.SOURCE_CONTINUE;
    });
    this._refreshRunningIndicators();
  }

  _buildPanelMenu() {
    this._button = new PanelMenu.Button(0.0, 'MAC Shell');
    this._button.add_style_class_name('mac-shell-indicator');
    this._button.add_child(new St.Label({ text: '⌘ MAC', y_align: St.Align.CENTER }));

    const overviewItem = new PopupMenu.PopupMenuItem('Show Overview');
    overviewItem.connect('activate', () => Main.overview.toggle());
    this._button.menu.addMenuItem(overviewItem);

    const launcherItem = new PopupMenu.PopupMenuItem('App Launcher');
    launcherItem.connect('activate', () => this._toggleLauncher());
    this._button.menu.addMenuItem(launcherItem);

    this._button.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this._addAppItem('Open Files', 'org.gnome.Nautilus.desktop');
    this._addAppItem('Open Web', 'org.gnome.Epiphany.desktop');
    this._addAppItem('Open Settings', 'org.gnome.Settings.desktop');
    this._addAppItem('Open Terminal', 'org.gnome.Terminal.desktop');
    this._button.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    const about = new PopupMenu.PopupMenuItem('About MAC OS');
    about.connect('activate', () => Main.notify('MAC OS', 'A Linux-based desktop prototype with its own MAC shell.'));
    this._button.menu.addMenuItem(about);
    Main.panel.addToStatusArea(this.uuid, this._button, 0, 'left');
  }

  _buildDock() {
    this._dock = new St.BoxLayout({ style_class: 'mac-dock', reactive: true });
    for (const [label, desktopId] of FAVORITES) this._addDockApp(label, desktopId);
    const divider = new St.Widget({ style_class: 'mac-dock-divider' });
    this._dock.add_child(divider);
    this._addDockLauncher();
    Main.layoutManager.addChrome(this._dock, { trackFullscreen: false, affectsStruts: false });
    this._positionDock();
  }

  _addDockApp(label, desktopId) {
    const app = Gio.DesktopAppInfo.new(desktopId);
    const icon = app?.create_icon_texture(32) ?? new St.Label({ text: label.slice(0, 1) });
    const indicator = new St.Widget({ style_class: 'mac-dock-indicator' });
    const content = new St.BoxLayout({ vertical: true, style_class: 'mac-dock-content' });
    content.add_child(icon);
    content.add_child(indicator);
    const button = new St.Button({
      style_class: 'mac-dock-item', can_focus: true, reactive: true,
      track_hover: true, child: content,
    });
    button.set_tooltip_text(app?.get_name() ?? label);
    button._macDesktopId = desktopId;
    button._macIndicator = indicator;
    button.connect('clicked', () => this._launch(desktopId));
    this._dock.add_child(button);
  }

  _addDockLauncher() {
    const icon = new St.Icon({ icon_name: 'view-app-grid-symbolic', icon_size: 28 });
    const button = new St.Button({ style_class: 'mac-dock-item mac-dock-launcher', can_focus: true, child: icon });
    button.set_tooltip_text('Applications');
    button.connect('clicked', () => this._toggleLauncher());
    this._dock.add_child(button);
  }

  _positionDock() {
    if (!this._dock) return;
    const monitor = Main.layoutManager.primaryMonitor;
    if (!monitor) return;
    const width = Math.min(monitor.width - 32, 560);
    this._dock.set_width(width);
    this._dock.set_x(monitor.x + Math.floor((monitor.width - width) / 2));
    this._dock.set_y(monitor.y + monitor.height - 78);
  }

  _refreshRunningIndicators() {
    if (!this._dock) return;
    const appSystem = Shell.AppSystem.get_default();
    for (const button of this._dock.get_children()) {
      if (!button._macDesktopId) continue;
      const app = appSystem.lookup_app(button._macDesktopId);
      const running = app?.get_state() === Shell.AppState.RUNNING;
      button._macIndicator?.set_style_class_name(running ? 'mac-dock-indicator mac-dock-indicator-running' : 'mac-dock-indicator');
    }
  }

  _toggleLauncher() {
    if (this._launcher) {
      this._closeLauncher();
      return;
    }
    this._launcher = new St.BoxLayout({ vertical: true, style_class: 'mac-launcher', width: 440 });
    this._launcherEntry = new St.Entry({
      style_class: 'mac-launcher-search', hint_text: 'Search applications…',
      can_focus: true, track_hover: true,
    });
    this._launcher.add_child(this._launcherEntry);
    this._launcherList = new St.BoxLayout({ vertical: true, style_class: 'mac-launcher-list' });
    this._launcher.add_child(this._launcherList);
    this._launcherSelection = 0;
    this._launcherEntry.clutter_text.connect('key-press-event', (_actor, event) => {
      const key = event.get_key_symbol();
      if (key === Clutter.KEY_Down || key === Clutter.KEY_Up) {
        this._moveLauncherSelection(key === Clutter.KEY_Down ? 1 : -1);
        return Clutter.EVENT_STOP;
      }
      if (key === Clutter.KEY_Return || key === Clutter.KEY_KP_Enter) {
        this._launchSelectedApp();
        return Clutter.EVENT_STOP;
      }
      if (key === Clutter.KEY_Escape) {
        this._closeLauncher();
        return Clutter.EVENT_STOP;
      }
      return Clutter.EVENT_PROPAGATE;
    });
    Main.layoutManager.addChrome(this._launcher, { affectsStruts: false });
    this._positionLauncher();
    this._populateLauncher('');
    this._launcherEntry.clutter_text.connect('text-changed', () => this._populateLauncher(this._launcherEntry.get_text()));
    this._launcherEntry.grab_key_focus();
  }

  _positionLauncher() {
    if (!this._launcher) return;
    const monitor = Main.layoutManager.primaryMonitor;
    if (!monitor) return;
    this._launcher.set_x(monitor.x + Math.floor((monitor.width - 440) / 2));
    this._launcher.set_y(monitor.y + Math.floor((monitor.height - 440) / 2));
  }

  _populateLauncher(query) {
    if (!this._launcherList) return;
    this._launcherList.destroy_all_children();
    const apps = Gio.AppInfo.get_all().filter(app => app.should_show())
      .sort((a, b) => a.get_name().localeCompare(b.get_name()));
    const normalized = query.trim().toLowerCase();
    const matches = apps.filter(app => app.get_name().toLowerCase().includes(normalized)).slice(0, 14);
    this._launcherApps = matches;
    this._launcherSelection = 0;
    if (!matches.length) {
      this._launcherList.add_child(new St.Label({ text: 'No applications found', style_class: 'mac-launcher-empty' }));
      return;
    }
    for (const [index, app] of matches.entries()) {
      const iconActor = new St.Icon({ gicon: app.get_icon() ?? null, icon_name: app.get_icon() ? undefined : 'application-x-executable', icon_size: 24, style_class: 'mac-launcher-app-icon' });
      const rowContent = new St.BoxLayout({ style_class: 'mac-launcher-row-content' });
      rowContent.add_child(iconActor);
      rowContent.add_child(new St.Label({ text: app.get_name(), x_align: Clutter.ActorAlign.START }));
      const row = new St.Button({ style_class: 'mac-launcher-row', can_focus: true, child: rowContent });
      row.connect('clicked', () => this._launchLauncherApp(app));
      if (index === 0) row.add_style_class_name('mac-launcher-row-selected');
      this._launcherList.add_child(row);
    }
  }

  _moveLauncherSelection(direction) {
    const rows = this._launcherList?.get_children() ?? [];
    if (!rows.length) return;
    this._launcherSelection = Math.max(0, Math.min(rows.length - 1, this._launcherSelection + direction));
    rows.forEach((row, index) => row.set_style_class_name(index === this._launcherSelection ? 'mac-launcher-row mac-launcher-row-selected' : 'mac-launcher-row'));
  }

  _launchSelectedApp() {
    const app = this._launcherApps?.[this._launcherSelection];
    if (app) this._launchLauncherApp(app);
  }

  _launchLauncherApp(app) {
    app.launch([], null);
    this._closeLauncher();
  }

  _closeLauncher() {
    if (this._launcher) Main.layoutManager.removeChrome(this._launcher);
    this._launcher?.destroy();
    this._launcher = null;
    this._launcherEntry = null;
    this._launcherList = null;
    this._launcherApps = null;
  }

  _addAppItem(label, desktopId) {
    const item = new PopupMenu.PopupMenuItem(label);
    item.connect('activate', () => this._launch(desktopId));
    this._button.menu.addMenuItem(item);
  }

  _launch(desktopId) {
    const app = Gio.DesktopAppInfo.new(desktopId);
    if (app) app.launch([], null);
    else Main.notify('MAC OS', `Application is unavailable: ${desktopId}`);
  }

  disable() {
    if (this._runningAppsTimer) GLib.source_remove(this._runningAppsTimer);
    this._runningAppsTimer = null;
    if (this._monitorSignal) Main.layoutManager.disconnect(this._monitorSignal);
    this._monitorSignal = null;
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
