exports.createApi = function(express) {
  express.get('/api/list', function(req, res) {
    var paths = [];
    express._router.stack.forEach(function(s) {
      if (s.route != undefined) {
        var path = s.route.path.match(/(\/[a-zA-Z0-9]*\/)/i);
        if (path != null) {
          path = path[0];
          if (paths.indexOf(path) == -1 && path != '/api/') {
            paths.push(path);
          }
        }
      }
    });

    // send the JSON respone
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(paths));
  });
};
