import St from 'gi://St';
import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class MacShellExtension extends Extension {
  enable() {
    this._button = new St.Bin({
      style_class: 'mac-shell-indicator',
      reactive: true,
      can_focus: true,
      track_hover: true,
      child: new St.Label({ text: '⌘ MAC' }),
    });
    this._button.connect('button-press-event', () => {
      Main.overview.toggle();
    });
    Main.panel.addToStatusArea(this.uuid, this._button, 0, 'left');
  }

  disable() {
    this._button?.destroy();
    this._button = null;
  }
}
