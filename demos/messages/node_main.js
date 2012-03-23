// ==========
// web server 
var app = require("express").createServer();

app.get("/", function (req, res) {
  res.sendfile(__dirname + "/index.html");
});

app.get("/:dir/:path", function (req, res) {
  res.sendfile(__dirname + "/" + req.params.dir + "/" + req.params.path);
});

app.listen(8080);

// ==========
// socket server
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: 4502});
var sockets = [];

wss.on("connection", function(ws) {
  sockets.push(ws);

  ws.on("message", function(message) {
    var a; 
    for (a = 0; a < sockets.length; a++) {
      var socket = sockets[a];
      if (socket != ws)
        socket.send(message);
    }
  });
  
  ws.on("close", function() {
    var a; 
    for (a = 0; a < sockets.length; a++) {
      var socket = sockets[a];
      if (socket == ws) {
        sockets.splice(a, 1);
        break;
      }
    }
  });
});