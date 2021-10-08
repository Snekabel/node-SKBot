import Command from '../classes/command.js';
//const {getYoutube, tryFilter} = require("../lib");
import {getYoutube, tryFilter} from "../lib.js";
import serviceController from '../controllers/serviceController.js';
import settingsController from '../controllers/settingsController.js';
import Answer from '../classes/answer.js';

class Radio extends Command {

  constructor(settings,sliceKey) {
    super(settings,sliceKey);

    this.helpDescription = "Radio command. Plays constant streams of music from predefined sources.";
    this.cI = settingsController.settings.commandInitiator;
    //this.commands = this.cI+"stations";
    this.commands = {
      "stations": {
        "desc": "Lists Stations",
        "func": this.listStations.bind(this)
      },
      "stationsPlay": {
        "desc": "Play Specific Station",
        "func": this.playStation.bind(this)
      },
      "stationsStop": {
        "desc": "Play Specific Station",
        "func": this.stopPlaying.bind(this)
      },
    }
  }

  evaluateMessage(input, service) {
    console.log("Testing Radio Input",input);
    return super.evaluateMessage(input,service);
    //console.log("service",service);

    this.service = service;
    this.input = input;
    var services = serviceController.getOtherServices(service);

    var message = input.message;
    //var split = message.split(/\s+/);

    //console.log(this.playlist);

    //var inputText = "!stations add bandit http://bandit.mp3";
    //console.log("INPUT: ",message);
    /*tryFilter("cIstations $name", message, function(result) {
      console.log("Start station");
      this.playStation(input,result[0]);
    }.bind(this));
    tryFilter("cIstations add $name $url", message, function(result) {
      console.log("Add Station");
      this.addStation(input,{name: result[0], url: result[1]});
    }.bind(this));
    tryFilter("cIstations", message, function() {
      console.log("List Stations");
      //return this.listStations(input);
    }.bind(this));
    tryFilter("cIstop", message, function(result) {
      this.stopPlaying(input);
    }.bind(this))*/
  }

  addStation(input,station) {
    this.service.writeLine(this.input.to, "Adding "+station.name+" to Stations list");
    this.settings.stations.push(station);
  }

  playStation(input) {
    const station = input.parameters[0][0];
    console.log("Look for station: ", station);
    for(let i = 0; i < this.settings.stations.length; i++){
      if(this.settings.stations[i].name.toLowerCase() == station.toLowerCase()) {
        //this.service.writeLine(this.input.to, "Playing "+station);
        //this.service.playSound(this.settings.stations[i].url,null);
        return new Answer(input.to, "Playing "+station).setAudio(this.settings.stations[i].url);
      }
    }
  }
  stopPlaying(input) {
    /*if(this.service.leaveAudiochannel) {
      this.service.leaveAudiochannel();
    }*/
  }

  listStations(input) {
    let message = "Stations available: ";
    for(let i = 0; i < this.settings.stations.length; i++){
      let station = this.settings.stations[i];
      message+= station.name+", ";
    }
    //this.service.writeLine(this.input.to, message);
    return new Answer(input.to, message);
  }

  cleanURL(dirtyURL) {
    var cleanURL = dirtyURL.substring(dirtyURL.indexOf("https://"));
    console.log("Clean1: ", cleanURL);
    if(cleanURL.indexOf("\"") > -1)
    {
      cleanURL = cleanURL.substring(0, cleanURL.indexOf("\""));
    }
    console.log("Clean2: ", cleanURL);
    return cleanURL;
  }


}
export default Radio;
