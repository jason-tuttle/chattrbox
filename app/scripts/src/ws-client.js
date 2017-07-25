// connect to server
let socket;

function init(url) {
  socket = new WebSocket(url);
  console.log('connecting...');
}

// perform initial setup when connection is first opened
function registerOpenHandler(handlerFunction) {
  socket.onopen = () => { // .onopen calls anonymous function just like function () {}
    console.log('open');
    handlerFunction();
  };
}

// forward incoming messages to their handlers
function registerMessageHandler(handlerFunction) {
  socket.onmessage = (e) => { // e is event data
    console.log('message', e.data);
    let data = JSON.parse(e.data);
    handlerFunction(data);
  };
}

// send outgoing messages
function sendMessage(payload) {
  socket.send(JSON.stringify(payload));
}

// **CHAPTER 17 SILVER CHALLENGE p629
// notify for closed connection
function registerCloseHandler(handlerFunction) {
  socket.onclose = () => {
    console.log('conection closed.');
    handlerFunction();
  };
}

export default {
  init,
  registerOpenHandler,
  registerMessageHandler,
  sendMessage,
  registerCloseHandler
};
