var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({ port: port });

var messages = []; // array to hold message history for new clients
var loggedIn = false;

console.log('websockets server started');

ws.on('connection', function (socket) {

  console.log('client connection established');

  // send message history to new clients on connection
  messages.forEach(function (msg) { socket.send(msg); });

  socket.on('message', function (data) {
    console.log('message received: ' + data);
    messages.push(data);
    ws.clients.forEach(function (clientSocket) {  // send new messages to each client
      clientSocket.send(data)
    });
  });
});
