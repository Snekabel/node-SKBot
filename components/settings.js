var fs = require('fs');
import commandController from './controllers/commandController.js';
import serviceController from './controllers/serviceController.js';
//import api from './api';

class Settings {

  constructor(commandController, serviceController) {
    this.settings = {
      sqlhost: null,
      api: {
        port: null
      },
      commandInitiator: "!"
    }
    /*commandController = commandController;
    serviceController = serviceController;*/
  }

  readFile() {
    if(fs.existsSync("settings.json")) {
      var raw = fs.readFileSync('settings.json').toString();
      this.json = JSON.parse(raw);
      console.log(this.json);
      this.parseSettings();
    }
    else {
      var baseSettings = {
        "mysql_host":{},
        "mumble": [],
        "email": [],
        "irc": [],
        "commandInitiator": "!"
      }
      fs.writeFileSync('settings.json', JSON.stringify(baseSettings));
      console.log("Edit settings.json to add services for the bot");
      process.exit(1);
    }
  }

  saveConfig() {
    for(service in serviceController.services) {
      console.log(service.hostConfig);
    }
  }

  setSQLHost(newHost) {
    this.settings.sqlhost = newHost;
  }

  addIRCHost(newHost) {
    serviceController.loadService("irc", newHost);
  }
  addMumbleHost(newHost) {
    serviceController.loadService("mumble", newHost);
  }
  addDiscordHost(newHost) {
    serviceController.loadService("discord", newHost);
  }
  addTelegramHost(newHost) {
    serviceController.loadService("telegram", newHost);
  }
  addTwitchHost(newHost) {
    serviceController.loadService("twitch", newHost);
  }
  addEmailHost(newHost) {
    this.settings.email_connections.push(newHost);
  }
  startAPI(config) {
    //api.setPort(config.port);
    //api.start();
  }
  setCommandInitiator(commandInitiator) {
    this.settings.commandInitiator = commandInitiator;
  }

  parseSettings() {
    var json = this.json;
    if(json.mysql_host != null) {
      this.setSQLHost(json.mysql_host);
    }
    if(json.mumble != null) {
      for(var row in json.mumble) {
        //console.log(row, this.json[row]);
        this.addMumbleHost(json.mumble[row]);
      }
    }
    if(json.discord != null) {
      console.log(json.discord);
      for(var row in json.discord) {
        //console.log(row, this.json[row]);
        this.addDiscordHost(json.discord[row]);
      }
    }
    if(json.telegram != null) {
      console.log(json.telegram);
      for(var row in json.telegram) {
        //console.log(row, this.json[row]);
        this.addTelegramHost(json.telegram[row]);
      }
    }
    if(json.email != null) {
      for(var row in json.email) {
        this.addEmailHost(json.email[row]);
      }
    }
    if(json.irc != null) {
      for(var row in json.irc)
      {
        this.addIRCHost(json.irc[row]);
      }
    }
    if(json.twitch != null) {
      for(var row in json.irc)
      {
        if(!row.disabled) {
          this.addTwitchHost(json.twitch[row]);
        }
      }
    }
    if(json.commands != null) {
      for(var row in json.commands)
      {
        //console.log("row: ",row, json.commands[row]);
        commandController.loadCommand(row, json.commands[row]);
      }
    }
    if(json.api != null) {
      this.startAPI(json.api);
    }
    if(json.commandInitiator != null) {
      this.setCommandInitiator(json.commandInitiator);
    }
  }

}

var settings = new Settings();

export default settings;
