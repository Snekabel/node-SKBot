import Command from '../command';

class Reload extends Command {
  constructor(commandController) {
    super();
    this.cc = commandController;
  }

  evaluateMessage(input,service){
    var split = input.message.split(/\s+/);
    if(split[0] == "reload" && split.length > 1) {
      service.writeLine(input.to, (split[1]+" reloaded"));
      this.reload(split[1]);
    }
  }

  reload(commandName) {
    this.cc.loadCommand(commandName);
  }
}
export default Reload;
