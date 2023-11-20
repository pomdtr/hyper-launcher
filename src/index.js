// @ts-check

// @ts-ignore
const { globalShortcut, dialog, app, Tray, Menu, shell } = require("electron");
const { toggleWindows, hideWindows, showWindows } = require("./window");
const { getCenterOnCurrentScreen } = require("./screen");
const path = require("path");
const os = require("os");

let unload = () => { }

function onApp(app) {
  const { hotkey } = Object.assign(
    { hotkey: "Ctrl+;" },
    app.config.getConfig().sunbeam
  );

  app.dock.hide();

  const tray = new Tray(path.join(__dirname, "../assets/trayicon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Sunbeam',
      click: () => {
        showWindows(app);
      },
      accelerator: hotkey,
    },
    {
      label: 'Edit Config',
      click: () => {
        shell.openPath(path.join(os.homedir(), '.config', 'sunbeam', 'sunbeam.json'))
      },
    },
    { type: 'separator' },
    {
      label: 'Open Website',
      click: () => {
        shell.openExternal('https://sunbeam.deno.dev/docs');
      },
    },
    {
      label: 'Open Repository',
      click: () => {
        shell.openExternal('https://github.com/pomdtr/sunbeam');
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Sunbeam');
  tray.setContextMenu(contextMenu);

  const onActivate = () => {
    showWindows(app);
  }
  app.on("activate", onActivate);

  const onBlur = () => {
    hideWindows(app);
  }
  app.on("browser-window-blur", onBlur);

  if (!hotkey) return;
  globalShortcut.unregister(hotkey);
  if (!globalShortcut.register(hotkey, () => toggleWindows(app))) {
    dialog.showMessageBox({
      message: `Could not register hotkey (${hotkey})`,
      buttons: ["Ok"]
    });
  }

  unload = () => {
    app.dock.show();
    app.removeListener("activate", onActivate);
    app.removeListener("browser-window-blur", onBlur);
    globalShortcut.unregister(hotkey);
  };
};

function onWindow(win) {
  win.on("close", () => {
    app.hide()
  });
}


function onUnload() {
  unload();
}

// Hide window controls on macOS
function decorateBrowserOptions(defaults) {
  const bounds = getCenterOnCurrentScreen(defaults.width, defaults.height);
  return Object.assign({}, defaults, {
    ...bounds,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    type: "panel",
    skipTaskbar: true,
    movable: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    resizable: false
  });
};

module.exports = {
  onApp,
  onWindow,
  onUnload,
  decorateBrowserOptions
};
