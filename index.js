// Dependencies
const {app, BrowserWindow} = require('electron');
const PeerServer = require('peer').PeerServer;
const Express = require('express');
const utils = require('./functions.js');
const path = require('path');
const url = require('url');
const ip = require('ip');
const fs = require('fs');

// Constants
const PEER_PORT    = 9000;
const EXPRESS_PORT = 8000;
const C_FOLDER = path.join(__dirname, 'cartridges');

// Initialize PeerJs server
var peerServer = PeerServer({port: PEER_PORT});
console.log('PeerServer running on ' + ip.address() + ':' + PEER_PORT);

// Initialize Electron
var win;
app.on('ready', () => {
  win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false
    }
  });
  initExpress();
  win.loadURL('http://localhost:' + EXPRESS_PORT + '/beemo.html');              // TODO Change this part
  win.on('closed', () => {
    win = null;
  });
  console.log('Window is ready');
});
app.on('window-all-closed', () => {
  app.quit();
});

// Initialize Express paths
function initExpress() {
  var express = Express();
  var cartridges = fs.readdirSync(C_FOLDER).filter(file => {
    return fs.statSync(path.join(C_FOLDER, file)).isDirectory();                // Get all the cartridges
  });
  cartridges.forEach(cartridge => {
    var folder = path.join(C_FOLDER, cartridge);
    var pack = require(path.join(folder, 'package.json'));
    if (pack.route != undefined) {
      utils.createPath(express, win, EXPRESS_PORT, pack, folder);
    } else {
      require(folder).createPath(express, win, EXPRESS_PORT);                   // Calls the custom createPath function
    }
    if (pack.api != undefined && pack.api) {
      require(folder).createApi(express);                                       // Create custom apis
    }
    console.log('Created paths for ' + pack.name);
  });
  express.listen(EXPRESS_PORT);
  console.log('Express running on ' + ip.address() + ':' + EXPRESS_PORT);
}
