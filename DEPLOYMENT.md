# Deployment
[electron-builder](https://www.electron.build) is a complete solution to package and build a ready for distribution Electron app for macOS, Windows and Linux with “auto update” support out of the box.

## Requirements
Use the [dev](https://github.com/ProyectoIntegrador2018/mei_frontend/tree/dev) branch of this project.

## Installation
[Yarn](https://yarnpkg.com/en/) is [strongly](https://github.com/electron-userland/electron-builder/issues/1147#issuecomment-276284477) recommended over npm.
```bash
$ yarn add electron-builder --dev
```

## Quick setup

1. Specify the usual fields in the `ElectronFlaskTest/package.json` (name, author, description and version)
2. Add the `build` filed to the `package.json`
```bash
"build": {
  "appId": "your.id",
  "mac": {
    "category": "your.app.category.type"
  }
}
```
3. Add the following `scripts`to the `ElectronFlaskTest/package.json`
```bash
"scripts": {
  "pack": "electron-builder --dir",
  "dist": "electron-builder -mwl"
}
```

## Deploying
Running the following command will create a `dist` directory with the Windows, Linux and MacOS versions of the Electron application.
```bash
$ yarn dist
```
