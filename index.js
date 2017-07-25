var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');
// SILVER CHALLENGE P.553
var mime = require('mime');

var handleError = function (err, res) {
  res.writeHead(404);
  fs.readFile('app/404.html', function(err, data) {
    res.end(data);
  });
  //res.end();
}

var server = http.createServer(function (req, res) {
  console.log('Responding to a request.');

  var filePath = extract(req.url);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      var mType = mime.lookup(filePath);    //SILVER
      res.setHeader('Content-type', mType); //SILVER
      res.end(data);
    }
  });
});
server.listen(3000);
