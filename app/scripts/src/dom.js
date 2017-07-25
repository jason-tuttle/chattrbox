import $ from 'jquery';
import md5 from 'crypto-js/md5';
import moment from 'moment';

function createGravatarURL(username) {
  let userhash = md5(username); // creates a hash value from the username
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

export function promptForUsername() {
  let username = prompt('Enter a username');
  return username.toLowerCase();
}

export class ChatForm {
  constructor(formSel, inputSel) {
    this.$form = $(formSel);
    this.$input = $(inputSel);
  }
  init(submitCallback) {
    this.$form.submit((event) => {
      event.preventDefault();
      let val = this.$input.val();
      submitCallback(val);
      this.$input.val('');
    });
    this.$form.find('button').on('click', () => this.$form.submit());
  }
}

export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
  }
  drawMessage({user: u, timestamp: t, message: m}) {
    // create a row for adding message info to the window
    let $messageRow = $('<li>', {
      'class': 'message-row'
    });
    // check to see if this message is the user's own:
    if (this.username === u) {
      $messageRow.addClass('me');
    }
    // get and add the username
    let $message = $('<p>');
    $message.append($('<span>', {
      'class': 'message-username',
      text: u
    }));
    // get and add the timestamp
    $message.append($('<span>', {
      'class': 'timestamp',
      'data-time': t,
      text: moment(t).fromNow()
    }));
    // get and add the message text
    $message.append($('<span>', {
      'class': 'message-message',
      text: m
    }));
    // get the user's Gravatar image
    let $img = $('<img>', {
      src: createGravatarURL(u),
      title: u
    });

    $messageRow.append($img);
    $messageRow.append($message);
    var now = moment();
    var then = moment(t);
    if (now.diff(then, 'seconds') < 10) {
      $messageRow.hide().fadeIn(300);
    }
    this.$list.append($messageRow);
    $messageRow.get(0).scrollIntoView();
    var array = $.makeArray(this.$list);
    return array;
  }
  init() {
    this.timer = setInterval(() => {
      $('[data-time]').each((idx, element) => {
        let $element = $(element);
        let timestamp = new Date().setTime($element.attr('data-time'));
        let ago = moment(timestamp).fromNow();
        $element.html(ago);
      });
    }, 1000);
  }
}
