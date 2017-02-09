const Express = require('express');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const ip = require('ip');

const BEEMO_FILENAME = 'beemo.html';
const APP_NAME = 'local';
const ROUTE = '/local/';
const PORT  = 8888;

exports.createPath = function(express, win, port) {
  express.get(ROUTE, function(req, res) {
    if (global.openApp != APP_NAME) {
      win.loadURL('http://localhost:' + port + ROUTE + BEEMO_FILENAME);
      global.openApp = APP_NAME;
    }
    if (shell.exec('pidof vlc') == '') {
      console.log('[LOCAL]: Starting VLC...');
      shell.exec('vlc -I http --http-password yolo --http-port 8888', ()=> {});
    } else {
      console.log('[LOCAL]: VLC already running');
    }
    var link = 'http://' + ip.address() + ':' + PORT + '/mobile.html';
    res.send('<meta http-equiv="refresh" content="0; url=' + link + '" />');
  });

  express.get(ROUTE + BEEMO_FILENAME, function(req, res) {
    console.log(APP_NAME + ' has been loaded');
    res.send(fs.readFileSync(path.join(__dirname, BEEMO_FILENAME), 'utf-8'));
  });

  express.use(ROUTE + 'assets',
    Express.static(path.join(__dirname, 'assets'))
  );
};
