var irc = require('irc');

class IRC {
  constructor(hc, commandController) {
    console.log("Loading IRC with config ",hc);
    this.cc = commandController;

    var client = new irc.Client(hc.hostname, hc.name, {
      channels: hc.channels
    });
    this.client = client;

    client.addListener('message', function (from, to, message) {
      console.log(from + ' => ' + to + ': ' + message);

      var input = {
        "message": message,
        "from": from,
        "to": to
      };
      for(var command in this.cc.commands) {
        this.cc.commands[command].evaluateMessage(input, this);
      }
    }.bind(this));
  }

  writeLine(to, text) {
    this.client.say(to, text);
  }
}

export default IRC;
