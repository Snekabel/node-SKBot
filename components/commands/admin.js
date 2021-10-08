import Command from '../classes/command.js';

class Template extends Command {

  constructor(settings) {
    super(settings);

    this.helpDescription = "Template Long Help";
    this.shortDescription= "Template Short Help";

    this.counter = 0;
  }

  evaluateMessage(input, service) {
    //console.log("service",service);
    //var services = super.getOtherServices(service);

    var answers = [];
    var message = input.message;
    /*
      Example Code
    */
    if(message == "test"){
      answers.push({"text": "EVAL IS Test: "+this.counter});
      this.counter++;
    }
    else if(message == "pokemon") {
      answers.push({"text": "Playing Pokémon", "audio": "102-palette_town_theme.mp3"});
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
  }
  evaluateFile(input) {
    return;
  }
}
export default Template;
