module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    make: {
      options: {
        productName: "desktopper",
        name: "desktopper",
        arch: "x64",
        dir: "./release-builds/desktopper-win32-ia32",
        out: "./dist",
        icon: "./assets/icons/win/icon.ico",
        ignore: ["node_modules"],
        exe: "desktopper.exe",
        setupExe: "desktopper.exe",
        setupIcon: "./assets/icons/win/icon.ico",
      },
    },
  });

  grunt.loadNpmTasks("grunt-electron-installer");

  grunt.registerTask("default", ["make"]);
};
