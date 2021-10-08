//import Test from './commands/test';

class CommandController {
  constructor() {
    this.commands = {};
    //this.sc = null;

    //this.loadCommand('test');
  }

  async loadCommand(commandName, commandSettings) {
    //let commandName = commandSettings.name;
    //console.log("commandSettings",commandSettings);
    //var command = reRequire('../commands/'+commandName).default;
    console.log("Loading ",commandName);
    import('../commands/'+commandName+".js").then(
    //import('./test.js').then(
      function(command) {
        let c = command.default;
        console.log(commandName, "Command: ", c);

        //this.commands[commandName] = (new command(commandSettings, commandName));
        this.commands[commandName] = new c(commandSettings, commandName);
      }.bind(this)
    ).catch(
      function(err) {
        console.error("Error loading command: "+commandName,err);
      }
    )
    //let {Test} = await import('../commands/'+commandName+".js");
    //let { default:Test } await import('../commands/'+commandName+".js");
    //let Test = await import('../commands/'+commandName+".js");
    //let obj = await import('./test.js');
    //let obj = await import('../commands/test.js');
    //console.log(obj.Test);
    //let t = obj.default;
    //console.log(t);
    //let t = new obj.Test();

  }

  /*setSC(serviceController) {
    this.sc = serviceController;
  }*/
}

var commandController = new CommandController();
export default commandController;
