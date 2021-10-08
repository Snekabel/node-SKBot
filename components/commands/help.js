import Command from '../classes/command.js';
import commandController from '../controllers/commandController.js';
import Answer from '../classes/answer.js';

class Help extends Command {
  constructor(commandSettings) {
    super();
    this.commandSettings = commandSettings;
  }

  evaluateMessage(input,service){
    var answers = [];
    var message = input.message;
    //console.log("services: ",services);

    let promise = new Promise((resolve, reject) => {
      var split = input.message.split(/\s+/);
      if(split[0] == "help") {
        if(split.length > 0) {
          // Specific help for some command
          if(commandController.commands[split[1]] && commandController.commands[split[1]].helpDescription) {
            //service.writeLine(input.to, ("Help for "+split[1]+ ": "+commandController.commands[split[1]].helpDescription));
            answers.push(
              new Answer(
                input.to,
                ("Help for "+split[1]+ ": "+commandController.commands[split[1]].helpDescription)
              )
            )
          }
        }
        // General purpose help
        let basicCommands = "";
        for(let c in commandController.commands) {
          if(commandController.commands.hasOwnProperty(c)) {
            let command = commandController.commands[c];
            if(command.commands){
              //console.log("We got commands: ", command.commands);
              basicCommands = basicCommands + command.commands+", ";
            }
          }
        }
        //console.log("BasicCommands: ",basicCommands);
        answers.push(
          new Answer(
            input.to,
            this.commandSettings.helptext + basicCommands
          )
        )
      }
      resolve(answers);
    });
    return promise;
  }
  evaluateFile(input) {
    return;
  }
}
export default Help;
