//import Test from './commands/test';
var reRequire = require('re-require-module').reRequire;

class CommandController {
  constructor() {
    this.commands = {};
    //this.sc = null;

    //this.loadCommand('test');
  }

  loadCommand(commandName) {
    var command = reRequire('./commands/'+commandName).default;
    //console.log(command);
    this.commands[commandName] = (new command(this));
  }

  /*setSC(serviceController) {
    this.sc = serviceController;
  }*/
}


export default CommandController;
