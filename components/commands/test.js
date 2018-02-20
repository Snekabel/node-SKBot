import Command from '../command';
var Promise = require('promise');

class Test extends Command {

  constructor(serviceController) {
    super();

    this.helpDescription = "Test Help";
    this.shortDescription= "TH";
  }

  evaluate(input, service) {
    //console.log("service",service);
    var services = super.getServices(service);

    var answers = [];

    //return new Promise(function (fulfill, reject){
      var message = input.message;
      if(message == "test"){
        answers.push({"text": "EVAL IS Test"});
      }
      else if(message == "pokemon") {
        answers.push({"text": "Playing Pokémon", "audio": "102-palette_town_theme.mp3"});
      }
      else if(message == "dragonforce") {
        answers.push({"text": "Playing Dragon Force: Through the Fire and the Flames", "audio": "/home/tb/Music/Dragon Force - Through the Fire and Flames.mp3"});
      }
      else if(message == "håll käften") {
        answers.push({"text": "HÅLL KÄFTEN", "audio": "shutup.mp3"});
      }
      else if(message == "pentiums") {
        answers.push({"text": "Weird Al Yankovic - It's all about the Pentiums", "audio": "/home/tb/Music/Weird Al Yankovic- All About The Pentiums.mp3"});
      }

      if(input.from == "tb") {
        answers.push({"text": "TB was here"});
      }

      for(var i in answers) {
        console.log(answers[i].text);
        if(service.writeLine) {
          service.writeLine(input.to,answers[i].text);
        }
        if(service.playSound) {
          service.playSound(answers[i].audio);
        }
      }
    //});
  }
}
export default Test;
