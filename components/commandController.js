//import Test from './commands/test';

class CommandController {
  constructor() {
    this.commands = {};
    //this.sc = null;

    //this.loadCommand('test');
  }

  loadCommand(commandName) {
    var command = require('./commands/'+commandName).default;
    //console.log(command);
    this.commands[commandName] = (new command());
  }

  /*setSC(serviceController) {
    this.sc = serviceController;
  }*/
}


export default CommandController;
