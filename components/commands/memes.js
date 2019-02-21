import Command from '../command';
var Promise = require('promise');

class Memes extends Command {

  constructor() {
    super();

    this.helpDescription = "Fresh memes";
    this.shortDescription= "Memetown USA";

    this.counter = 0;
  }

  evaluateMessage(input, service) {
    //console.log("service",service);
    var services = super.getServices(service);

    var answers = [];
    var message = input.message;
    if(message == "håll käften") {
      answers.push({"text": "HÅLL KÄFTEN", "audio": "shutup.mp3"});
    }
    else if(message == "phone") {
      answers.push({"audio": "./Gmod\ Bananaphone.mp3"});
    }
    else if(message == "överraskning") {
      answers.push({"text": "Oj vilken överraskning...", "audio": "./Oj.mp3"});
    }

    for(var i in answers) {
      if(service.writeLine && answers[i].text) {
        service.writeLine(input.to,answers[i].text);
      }
      if(service.playSound && answers[i].audio) {
        service.playSound(answers[i].audio, this.next);
      }
    }
  }
  evaluateFile(input) {
    return;
  }
  
  next() {
    console.log("Done");
  }
}
export default Memes;
