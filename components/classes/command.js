import settingsController from '../controllers/settingsController.js';
import fs from "fs";

class Command {

  constructor(commandSettings, sliceKey) {
    //console.log("Loading with sliceKey: ", sliceKey);
    this.helpDescription="No helptext for this command";
    this.shortDescription="No helptext for this command";
    this.settings = commandSettings;
    this.sliceKey = sliceKey;
    this.commands={};
    this.triggers={};
    if(fs.existsSync('./plugins/'+sliceKey+'.js')) {
      //console.log("Plugin for "+sliceKey+" exists, try importing it!");
      import('../../plugins/'+sliceKey+".js").then( function(plugins) {
        this.plugins = plugins;
        //console.log("Command plugins: ", plugins);
      }.bind(this));
    } else { /*console.log("No plugin found for "+sliceKey);*/ this.plugins = {}; }

  }

  /* Return Promise */
  evaluateMessage(input,service) {
    /*
    If a command doesn't wanna deal with basic case-insestivite comparison for commands, they can call super.evaluateMessage(input); and let this function deal with it.
    It will use the this.commands object to look for anything that will trigger functions, and run the included functions on those commands.
    */
    return new Promise((resolve, reject) => {
      let promises = [];
      let commandInitiator = settingsController.settings.commandInitiator;
      if(input.message_split.length > 0) {
        for(let c in this.commands) {
          if(this.commands.hasOwnProperty(c)) {
            c = c.toLowerCase();
            let w = input.message_split[0];
            if(commandInitiator+c === w) {
              const command = this.commands[Object.keys(this.commands).find(key => key.toLowerCase() === c.toLowerCase())];
              const res = command.func(input,service);
              console.log("Res: ", res);
              if(res) {
                if(res.then) {
                  // Result is an promise
                  promises.push(res);
                }
                else {
                  promises.push(Promise.resolve(res))
                }
              }
              //answers.push(this.commands[c].func(input,service));
            }
          }
        }
        //console.log("Done comparing with commands, doing triggers next");

        for(let i in input.message_split) {
          if(input.message_split.hasOwnProperty(i)) {
            //console.log("word: ", input.message_split[i]);
            for(let t in this.triggers) {
              //console.log("Checking trigger: ",t);
              if(this.triggers.hasOwnProperty(t)) {
                t = t.toLowerCase();
                let w = input.message_split[i];
                //console.log("Comparing: ", t, w, t.indexOf(w));
                //if(t === w) {
                if(w.indexOf(t) > -1) {
                  let res = this.triggers[t].func(input,service);
                  if(res.then) {
                    // Res is a promise better wait for data
                    //res.then(function(values) {
                    //  answers.push(values);
                    //})
                    //console.log("Trigger promise added");
                    promises.push(res);
                  }
                  else {
                    //answers.push(res);
                    promises.push(Promise.resolve(res));
                  }
                }
              }
            }
          }
        }
      }
      //console.log("Promises length: ", promises.length);
      Promise.all(promises).then(function(values) {
        console.log("Values: ", values);
        let answers = [];
        for(let v in values) {
          if(values.hasOwnProperty(v)) {
            //console.log("VALUES[V]",values[v]);
            answers = answers.concat(values[v]);
          }
        }
        //console.log("ANSWERS:",answers);
        resolve(answers);
      });


    });
  }

  evaluateFile(input) {
    return;
  }

  saveSetting(keyPath, value) {
    console.log("SaveSetting: ");
    console.log(this.sliceKey, keyPath, value);
    settingsController.saveSetting(this.sliceKey, keyPath, value);
  }
}

export default Command;
