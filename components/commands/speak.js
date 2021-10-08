const say = require('say')
import Command from '../classes/command.js';
import commandController from '../controllers/commandController.js';
import Answer from '../classes/answer.js';

class Speak extends Command {
  constructor(settings) {
    super(settings);
  }

  evaluateMessage(input,service){
    let promise = new Promise((resolve, reject) => {
      say.speak('Hello!')
      resolve();
      //this.service.playSound(this.settings.stations[i].url,null);
    });
    return promise;
  }

  speak(line) {
    console.log("Reloading ",commandName);
    commandController.loadCommand(commandName);
  }
}
export default Speak;
