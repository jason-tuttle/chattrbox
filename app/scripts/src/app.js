import socket from './ws-client';  // import the websocket object
import {UserStore, MessageStore} from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';   // import the form handler from dom.js

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

// Need to get the username first!
let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();
if (!username) {
  username = promptForUsername();
  userStore.set(username);
}
let messageStore = new MessageStore('x-chattrbox/m');
let messageList = messageStore.get();


class ChatApp {
  constructor() {
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);

    socket.init('ws://localhost:3001'); // open socket, provide the server URL
    socket.registerOpenHandler(() => {
      this.chatForm.init((data) => {
        let message = new ChatMessage({message: data});
        socket.sendMessage(message.serialize());
      });
      this.chatList.init();
    });
    socket.registerMessageHandler((data) => {
      console.log(data);
      let message = new ChatMessage(data);
      messageList = this.chatList.drawMessage(message.serialize());
      messageStore.set(messageList);
    });
  }
}

class ChatMessage { // constructor takes 3 parameters
  constructor({
    message: m,
    user: u=username,
    timestamp: t=(new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;  // optional, default "batman"
    this.timestamp = t; // optional, default to time of construction
  }
  serialize() { // return the data in a simple object to pass
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}

export default ChatApp;
