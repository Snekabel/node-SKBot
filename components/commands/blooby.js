import Command from '../classes/command.js';
import Answer from '../classes/answer.js';

class Blooby extends Command {

  constructor(settings,sliceKey) {
    super(settings,sliceKey);

    this.helpDescription = "Blooby";
    this.commands = {
      "blooby": {
        "desc": "BLOOBY!",
        "func": function(input) {return new Answer(input.to,"Blooby","102-palette_town_theme.mp3")}
      }
    }
  }

  evaluateMessage(input, service) {
    return super.evaluateMessage(input,service);
  }
}
export default Blooby;
