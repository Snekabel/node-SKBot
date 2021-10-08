import commandController from '../controllers/commandController.js';

class Service {
    constructor(hostConfig) {
      //this.cc = commandController;
      this.hostConfig = hostConfig;
    }


    quit(reason) {
    }

    /* All Things the Service needs to provide for the commands */
    writeLine(to, text) {
    }

    sendFancy(to, title, description) {
    }

    stopSound() {
    }

    playSound(url, onEnd) {
    }

    incrementVolume(addVolume) {
    }

    decreaseVolume(decreaseVolume) {
    }

    /* All eventhandlers that runs code when stuff happen */
    onMessage(inputObject){
      //console.log("Input TO: ", inputObject.to);
      /*for(let command in commandController.commands) {
        commandController.commands[command].evaluateMessage(input, this);
      }*/
      let commandPromises = [];
      for(var command in commandController.commands) {
        //console.log("Command in loop: ", command);
        try {
          //commandController.commands[command].evaluateMessage(input, this)
          commandPromises.push(commandController.commands[command].evaluateMessage(inputObject, this));
        }
        catch(err) {
          console.error(err);
        }
      }
      Promise.all(commandPromises).then(function(values) {
        //console.log("Promise Values",values);
        for(let v in values) {
          if(values.hasOwnProperty(v)) {
            // Loop all the answeres we got from different commands
            let promiseResult = values[v];

            for(let o in promiseResult) {
              if(promiseResult.hasOwnProperty(o) && promiseResult[o]) {
                // If an command gives multiple answers loop them too
                let answer = promiseResult[o];
                //console.log("A: ", answer);
                this.evaluateAnswer(answer);
              }
            }
          }
        }
      }.bind(this))
    }
}

export default Service;
