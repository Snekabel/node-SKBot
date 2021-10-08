//var irc = require('irc');
import irc from 'irc';
import commandController from '../controllers/commandController.js';
import Service from '../classes/service.js';
import Input from '../classes/input.js';

class IRC extends Service {
  constructor(hostConfig) {
    super(hostConfig);
    this.name = "irc";
    //console.log("Loading IRC with config ",hostConfig);

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
      let inputObject = new Input(input);
      this.onMessage(inputObject)  
    }.bind(this));
  }

  evaluateAnswer(answer) {
    //console.log("Answer: ",answer.to.service.name, this.name);
    if(answer.to.service && answer.to.service.name !== this.name) {
      // Send this to this other service
      //console.log("Send this to another service");
      answer.to.service.evaluateAnswer(answer);
    }
    else {
      if(answer.text) {
        this.writeLine(answer.to.recipient, answer.text);
      }
    }
  }

  writeLine(to, text) {
    this.client.say(to, text);
  }
}

export default IRC;
