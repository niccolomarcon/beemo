// Dependencies
const Express = require('express');
const path = require('path');
const fs = require('fs');

// Constants
const ASSETS_DIRECTORY = 'assets';
const BEEMO_FILENAME   = 'beemo.html';

global.openApp = '';

exports.createPath = function(express, win, port, pack, folder) {
  // Route for the controller
  express.get(pack.route, function(req, res) {
    if (global.openApp != pack.name) {
      win.loadURL('http://localhost:' + port + pack.route + BEEMO_FILENAME);
      global.openApp = pack.name;
    }
    res.send(fs.readFileSync(path.join(folder, '/index.html'), 'utf-8'));
  });

  // Route for the beemo page
  express.get(pack.route + BEEMO_FILENAME, function(req, res) {
    res.send(fs.readFileSync(path.join(folder, BEEMO_FILENAME), 'utf-8'));
    console.log(pack.name + ' has been loaded');
  });

  // Route for the static files
  express.use(pack.route + ASSETS_DIRECTORY,
    Express.static(path.join(folder, ASSETS_DIRECTORY))
  );
};
