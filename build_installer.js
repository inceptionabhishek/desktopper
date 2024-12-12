const { MSICreator } = require("electron-wix-msi");
const path = require("path");
const APP_DIR = path.resolve(
  __dirname,
  "./release-builds/desktopper-win32-ia32"
);
const version = require("./package.json").version;
const OUT_DIR = path.resolve(__dirname, "./windows_installer");
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,
  description: "Boost Productivity for Remote Teams",
  exe: "desktopper",
  name: "desktopper",
  manufacturer: "desktopper",
  version: version,
  appUserModelId: "desktopper",
  icon: path.resolve(__dirname, "./assets/icons/win/icon.ico"),
  publisher: "desktopper",
});
msiCreator.create().then(function() {
  msiCreator.compile();
});
