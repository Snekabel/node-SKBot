import Command from '../command';
import commandController from '../commandController';

class Reload extends Command {
  constructor(commandController) {
    super();
  }

  evaluateMessage(input,service){
    var split = input.message.split(/\s+/);
    if(split[0] == "reload" && split.length > 1) {
      service.writeLine(input.to, (split[1]+" reloaded"));
      this.reload(split[1]);
    }
  }
  evaluateFile(input) {
    return;
  }

  reload(commandName) {
    commandController.loadCommand(commandName);
  }
}
export default Reload;
