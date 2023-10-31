// @ts-check

// @ts-ignore
const { globalShortcut, dialog } = require("electron");
const { toggleWindows, hideWindows, showWindows } = require("./window");
const { getCenterOnCurrentScreen } = require("./screen");

let unload = () => { }

function onApp(app) {
  const { hotkey } = Object.assign(
    { hotkey: "Ctrl+;" },
    app.config.getConfig().sunbeam
  );

  app.dock.hide();

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
  onUnload,
  decorateBrowserOptions
};
