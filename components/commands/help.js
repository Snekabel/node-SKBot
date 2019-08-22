import Command from '../command';
import commandController from '../commandController';

class Help extends Command {
  constructor(commandController) {
    super();
  }

  evaluateMessage(input,service){
    var split = input.message.split(/\s+/);
    if(split[0] == "help") {
      if(split.length > 0) {
        // Specific help for some command
        if(commandController.commands[split[1]]) {
          service.writeLine(input.to, ("Help for "+split[1]+ ": "+commandController.commands[split[1]].helpDescription));
        }
      }

    }
  }
  evaluateFile(input) {
    return;
  }
}
export default Help;
