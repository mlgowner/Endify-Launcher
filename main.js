const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process'); // Встроенный модуль
app.whenReady().then(() => {
  new BrowserWindow({ width: 800, height: 600 }).loadFile('public/index.html');
});