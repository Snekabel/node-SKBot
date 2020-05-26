const TelegramBot = require('node-telegram-bot-api');
import commandController from '../commandController';
import Service from '../service';

class Telegram extends Service {
  constructor(hostConfig) {
    super(hostConfig);

    console.log("Loading Telegram with config ",hostConfig);
    const token = hostConfig.token;

    this.bot = new TelegramBot(token, {polling: true});


    this.bot.on('message', (msg) => {
      this.onMessage(msg);
    });
  }

  onMessage(data) {
    console.log(data);

    const chatId = data.chat.id;
    //this.writeLine(chatId, 'Received your message');
    if(data.from.is_bot) {
      return;
    }


    var user = data.from;
    //console.log(user);
    //console.log(user.username + ':', data.content);
    let dm = false;
    if(data.chat.type === "private") {
      dm = true;
    }
    //console.log(data.channel.id);
    if(!data.text) {
      return
    }
    var input = {
      "message": data.text,
      "from": {
        "username": user.username,
        "id": user.id
      },
      "to": chatId
    };
    this.lastInput = input;
    for(var command in commandController.commands) {
      try {
        commandController.commands[command].evaluateMessage(input, this)
      }
      catch(err) {
        console.error(err);
      }
    }
  }

  writeLine(to, text) {
    this.bot.sendMessage(to, text);
  }
}

export default Telegram;
