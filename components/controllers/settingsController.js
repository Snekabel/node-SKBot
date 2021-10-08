//import Test from './commands/test';
//var reRequire = require('re-require-module').reRequire;
import reRequire from "re-require-module";
import commandController from './commandController.js';
import serviceController from './serviceController.js';
//var fs = require('fs');
import fs from "fs";
//import api from '../api.js';

class SettingsController {
  constructor() {
    console.log("SETTINGS CONTROLLER CONSTRUCTOR!");
    this.settings = {
      commandInitiator: "!"
    };
  }

  init() {
    this.readFile();
  }


  saveSetting(sliceKey, keyPath, newValue) {
    let slice;
      if(this.json.services[sliceKey]) {
        slice = this.json.services[sliceKey];
      }
      else if(this.json.commands[sliceKey]){
        slice = this.json.commands[sliceKey];
      }

      slice[keyPath] = newValue;

      this.writeFile(this.json);
  }

  readFile() {
    if(fs.existsSync("settings.json")) {
      var raw = fs.readFileSync('settings.json').toString();
      this.json = JSON.parse(raw);
      console.log(this.json);
      this.parseSettings(this.json);
    }
    else {
      this.initConfig();
    }
  }

  writeFile(obj) {
    fs.writeFileSync('settings.json', JSON.stringify(obj, null, 3));
  }

  initConfig() {
    var baseSettings = {
      "mysql_host":{},
      "commands": {
        "reload":{},
        "help":{}
      },
      "services":{

      },
      "commandInitiator": "!"
  };
  this.writeFile(baseSettings);
  console.log("Edit settings.json to add services for the bot");
  process.exit(1);
}

  parseSettings(json) {
    console.log("JSON: ", !!json);
    if(json.services != null) {
      for(var row in json.services)
      {
        if(json.services.hasOwnProperty(row) && !json.services[row].disabled) {
          console.log("row: ",row, json.services[row]);
          serviceController.loadService(json.services[row].type, json.services[row]);
        }
      }
    }
    if(json.commands != null) {
      for(var row in json.commands)
      {
        if(json.commands.hasOwnProperty(row) && !json.commands[row].disabled) {
          //console.log("row: ",row, json.commands[row]);
          commandController.loadCommand(row, json.commands[row]);
        }
      }
    }
    if(json.api != null) {
      //this.initAPI(json.api);
      //api.setSettings(json.api);
      //api.init();
    }
    if(json.commandInitiator) {
      this.settings.commandInitiator = json.commandInitiator;
    }
  }
}

var settingsController = new SettingsController();
console.log("SC is created: ", settingsController);
export default settingsController;
