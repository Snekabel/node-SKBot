//import Test from './commands/test';
var reRequire = require('re-require-module').reRequire;

class CommandController {
  constructor() {
    this.commands = {};
    //this.sc = null;

    //this.loadCommand('test');
  }

  loadCommand(commandSettings) {
    let commandName = commandSettings.name;
    var command = reRequire('./commands/'+commandName).default;
    console.log("Loading ",commandName);
    this.commands[commandName] = (new command(this, commandSettings));
  }

  /*setSC(serviceController) {
    this.sc = serviceController;
  }*/
}


export default CommandController;
