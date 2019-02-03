var fs = require('fs');

class Settings {

  constructor(commandController, serviceController) {
    this.settings = {
      sqlhost: null,
      api_port: null,
      commandInitiator: "!"
    }
    this.commandController = commandController;
    this.serviceController = serviceController;

    if(fs.existsSync("settings.json")) {
      var raw = fs.readFileSync('settings.json').toString();
      this.json = JSON.parse(raw);
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
    for(service in this.serviceController.services) {
      console.log(service.hostConfig);
    }
  }

  setSQLHost(newHost) {
    this.settings.sqlhost = newHost;
  }

  addIRCHost(newHost) {
    this.serviceController.loadService("irc", newHost);
  }
  addMumbleHost(newHost) {
    this.serviceController.loadService("mumble", newHost);
  }
  addDiscordHost(newHost) {
    this.serviceController.loadService("discord", newHost);
  }
  addEmailHost(newHost) {
    this.settings.email_connections.push(newHost);
  }
  addCommand(newCommand) {
    this.commandController.loadCommand(newCommand.name);
  }
  setAPIPort(newPort) {
    this.settings.api_port = newPort;
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
    if(json.commands != null) {
      for(var row in json.commands)
      {
        this.addCommand(json.commands[row]);
      }
    }
    if(json.api != null) {
      if(json.api.port != null) {
        this.setAPIPort(json.api.port);
      }
    }
    if(json.commandInitiator != null) {
      this.setCommandInitiator(json.commandInitiator);
    }
  }

}

export default Settings;
