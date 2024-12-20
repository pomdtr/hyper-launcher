# Hyper launcher

Make alfred behaves like an app launcher.

## Installation

Use the Hyper CLI, bundled with your Hyper app, to install hyperterm-launcher
by entering the following into Hyper:

```bash
hyper i hyperterm-launcher
```

## Options

| Key          | Description                                             | Default  |
| ------------ | ------------------------------------------------------- | -------- |
| `hotkey`     | Shortcut<sup>1</sup> to toggle Hyper window visibility. | `Ctrl+;` |

## Example Config

```js
module.exports = {
  config: {
    launcher: {
      hotkey: "Alt+Super+O"
    }
  },
  plugins: ["hyperterm-launcher"]
};
```

<sup>1</sup> For a list of valid shortcuts, see [Electron Accelerators](https://github.com/electron/electron/blob/master/docs/api/accelerator.md).
