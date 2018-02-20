var irc = require('irc');

class IRC {
  constructor(hc, commandController) {
    console.log("Loading IRC with config ",hc);
    this.cc = commandController;

    console.log("THIS CC", this.cc);

    var client = new irc.Client(hc.hostname, hc.name, {
      channels: hc.channels
    });
    this.client = client;

    client.addListener('message', function (from, to, message) {
      console.log(from + ' => ' + to + ': ' + message);

      for(var command in this.cc.commands) {
        /*this.cc.commands[command].evaluate(message).done(function(answers){
          for(var answer in answers) {
            if(answers[answer].text != null) {
              console.log("Text",answers[answer].text);
              client.say(to, answers[answer].text);
            }
          }
        }, function(reject) {console.log("Rejected")});
        */
        var input = {
          "message": message,
          "from": from,
          "to": to
        };
        this.cc.commands[command].evaluate(input, this);
      }
    }.bind(this));
  }

  writeLine(to, text) {
    this.client.say(to, text);
  }
}

export default IRC;
