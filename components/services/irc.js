var irc = require('irc');
import commandController from '../commandController';
import Service from '../service';

class IRC extends Service {
  constructor(hostConfig) {
    super(hostConfig);
    console.log("Loading IRC with config ",hostConfig);

    var client = new irc.Client(hostConfig.hostname, hostConfig.name, {
      channels: hostConfig.channels
    });
    this.client = client;

    client.addListener('message', function (from, to, message) {
      console.log(from + ' => ' + to + ': ' + message);

      var input = {
        "message": message,
        "from": {
          "username": from,
          "id": null
        },
        "to": to
      };
      for(let command in commandController.commands) {
        commandController.commands[command].evaluateMessage(input, this);
      }
    }.bind(this));
  }

  writeLine(to, text) {
    this.client.say(to, text);
  }
}

export default IRC;
