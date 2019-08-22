import Command from '../command';
var Promise = require('promise');
import serviceController from '../serviceController';

class Test extends Command {

  constructor() {
    super();

    this.helpDescription = "Test Help";
    this.shortDescription= "TH";

    this.counter = 0;
  }

  evaluateMessage(input, service) {
    //console.log("service",service);
    var services = serviceController.getServices(service);

    var answers = [];
    var message = input.message;
    if(message == "test"){
      answers.push({"text": "EVAL IS Test: "+this.counter});
      this.counter++;
    }
    else if(message == "pokemon") {
      answers.push({"text": "Playing Pokémon", "audio": "102-palette_town_theme.mp3"});
    }
    else if(message == "dragonforce") {
      answers.push({"text": "Playing Dragon Force: Through the Fire and the Flames", "audio": "./Music/Dragon Force - Through the Fire and Flames.mp3"});
    }
    else if(message == "pentiums") {
      answers.push({"text": "Weird Al Yankovic - It's all about the Pentiums", "audio": "./Music/Weird Al Yankovic- All About The Pentiums.mp3"});
    }
    else if(message == "phone") {
      answers.push({"audio": "./Gmod\ Bananaphone.mp3"});
    }
    else if(message == "youtube") {
      service.playSound("http://youtube.com/watch?v=ZI-ol25RFws");
    }

    if(input.from == "tb") {
      answers.push({"text": "TB was here"});
    }

    for(var i in answers) {
      console.log(answers[i].text);
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
export default Test;
