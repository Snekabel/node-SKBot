import Command from '../classes/command.js';
import commandController from '../controllers/commandController.js';
import Answer from '../classes/answer.js';

class Reload extends Command {
  constructor(settings) {
    super(settings);
  }

  evaluateMessage(input,service){
    let promise = new Promise((resolve, reject) => {
      let answers = [];
      var split = input.message.split(/\s+/);
      if(split[0] === "reload") {
        answers.push(
          new Answer(
            input.to,
            split[1]+" reloaded"
          )
        )
        this.reload(split[1]);
      }
      resolve(answers);
    });
    return promise;
  }

  reload(commandName) {
    console.log("Reloading ",commandName);
    commandController.loadCommand(commandName);
  }
}
export default Reload;
